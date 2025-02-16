
const User = require('../models/user');
const Role = require('../models/role');

const bcrypt = require('bcrypt');
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const { validatePassword } = require('../middleware/validate'); // Import the validation function
const transporter = require('../middleware/emailConfig'); // Import the email transporter

// Function to generate a dynamic avatar
const generateAvatar = (firstName, lastName) => {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  // Set background color
  ctx.fillStyle = '#4CAF50'; // Green background
  ctx.fillRect(0, 0, 200, 200);

  // Set text properties
  ctx.font = 'bold 80px Arial';
  ctx.fillStyle = '#FFFFFF'; // White text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Draw initials
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  ctx.fillText(initials, 100, 100);

  // Save the avatar to the imagesAvatar folder
  const avatarPath = path.join(__dirname, '../public/imagesAvatar', `${Date.now()}-avatar.png`);
  const out = fs.createWriteStream(avatarPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  return `/imagesAvatar/${path.basename(avatarPath)}`;
};



exports.signup = async (req, res) => {
    try {
      const { firstName, lastName, email, password, role, phone_number } = req.body;
  
      // Hash the password
      const password_hash = await bcrypt.hash(password, 10);
  
      let imagePath;
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (req.file) {
        imagePath = `/imagesUser/${req.file.filename}`;
      } else {
        imagePath = generateAvatar(firstName, lastName);
      }
  
      if (!emailRegex.test(email)) {
        return res.status(400).render('signup', { error: 'Please enter a valid email address.' });
      }
  
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).render('signup', { error: 'This email is already in use.' });
      }
  
      const passwordError = validatePassword(password);
      if (passwordError) {
        return res.status(400).render('signup', { error: passwordError });
      }
  
      // Generate verification token
      const verificationToken = crypto.randomBytes(20).toString('hex');
  
      let userRole;
        if (role) {
          userRole = await Role.findOne({ RoleName: role }); // Fetch role based on provided RoleName
        } else {
          userRole = await Role.findOne({ RoleName: 'Developer' }); // Default to 'Developer' role
        }

      const user = new User({
        firstName,
        lastName,
        email,
        password_hash,
        role:userRole._id,
        phone_number,
        image: imagePath,
        verificationToken,
        isVerified: false,
      });
  
      // Save the user to the database
      await user.save();
  
      const verificationUrl = `http://${req.headers.host}/users/verify-email?token=${verificationToken}`;
      const mailOptions = {
        to: email, // Send the email to the user's provided email address
        from: `Your App Name <${process.env.EMAIL_USER || 'no-reply@example.com'}>`, // Sender name and email
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following link: ${verificationUrl}`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.redirect('/users/signup');
    } catch (error) {
      console.error('Error during signup:', error); // Log the error for debugging
      res.status(500).render('signup', { error: 'An error occurred during signup. Please try again.' });
    }
  };





  exports.signin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      console.log('Sign-in attempt for email:', email); // Log the email
  
      // Find the user by email
      //const user = await User.findOne({ email });
      const user = await User.findOne({ email }).populate('role');
      if (!user) {
        console.log('User not found for email:', email); // Log if user is not found
        return res.status(400).render('signin', { error: 'User not found.' });
      }
  
      console.log('User found:', user.email); // Log the found user
  
      // Check if the user is verified
      if (!user.isVerified) {
        console.log('User not verified:', email); // Log if user is not verified
        return res.status(400).render('signin', { error: 'Please verify your email before signing in.', email });
      }
  
      // Compare the password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        console.log('Invalid password for email:', email); // Log if password is invalid
        return res.status(400).render('signin', { error: 'Invalid password.', email });
      }
  
      console.log('Sign-in successful for email:', email); // Log successful sign-in
  
      user.last_activity = Date.now();
      await user.save();
  
      // Set the user session
      req.session.user = user;
      console.log('Session created for user:', user.email); // Log session creation
      // Redirect to the home page
      if (user.role.RoleName === 'Admin') {
        //console.log('Redirecting to admin dashboard'); // Log admin redirection
        res.redirect('/admin/dashboard'); // Redirect to admin dashboard if role is admin
      } else {
        //console.log('Redirecting to home'); // Log admin redirection
        res.redirect('/home'); // Redirect to home for other roles
      }
    } catch (error) {
      console.error('Error during sign-in:', error); // Log the error for debugging
      res.status(500).render('signin', { error: 'An error occurred during sign-in. Please try again.' });
    }
  };


exports.checkmail =  async (req, res) => {
    const { email } = req.query;

    try {
        const user = await User.findOne({ email });
        res.json({ exists: !!user }); // Return true if email exists, false otherwise
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ error: 'Error checking email' });
    }
}


exports.logout = async (req, res) => {
    try {
      // Update the user's last_activity field
      if (req.session.user) {
        await User.findByIdAndUpdate(req.session.user._id, { last_activity: Date.now() });
      }
  
      // Destroy the session
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ message: 'Error logging out', error: err.message });
        }
  
        // Redirect to the sign-in page
        res.redirect('/users/signin');
      });
    } catch (error) {
      console.error('Error updating last_activity:', error);
      res.status(500).json({ message: 'Error logging out', error: error.message });
    }
  }



exports.verifyEmail = async (req, res) => {
    try {
      const { token } = req.query;
  
      const user = await User.findOne({ verificationToken: token });
  
      if (!user) {
        return res.status(400).render('signin', { error: 'Invalid or expired token.' });
      }
  
      user.isVerified = true;
      user.verificationToken = undefined; // Clear the token after verification
      await user.save();
  
      res.redirect(`/users/signin?email=${user.email}`);
    } catch (error) {
      console.error('Error verifying email:', error); // Log the error for debugging
      res.status(500).render('signin', { error: 'An error occurred while verifying your email. Please try again.' });
    }
  };
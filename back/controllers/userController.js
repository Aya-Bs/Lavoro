
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const { validatePassword ,validateUserInput } = require('../middleware/validate'); // Import the validation function
const transporter = require('../utils/emailConfig'); // Import the email transporter

// Function to generate a dynamic avatar
const generateAvatar = (firstName, lastName) => {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  // Set background color
  ctx.fillStyle = '#FF416C'; // Green background
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

      // Validate user input
      const validationError = validateUserInput({ firstName, lastName, phoneNumber: phone_number, password });
      if (validationError) {
          return res.status(400).json({ error: validationError });
      }

      // Hash the password
      const password_hash = await bcrypt.hash(password, 10);

      // Handle image upload or generate avatar
      let imagePath;
      if (req.file) {
          imagePath = `/imagesUser/${req.file.filename}`;
      } else {
          imagePath = generateAvatar(firstName, lastName);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({ error: 'Please enter a valid email address.' });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: 'This email is already in use.' });
      }

      // Validate password
      const passwordError = validatePassword(password);
      if (passwordError) {
          return res.status(400).json({ error: passwordError });
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(20).toString('hex');

      // Create new user
      const user = new User({
          firstName,
          lastName,
          email,
          password_hash,
          role,
          phone_number,
          image: imagePath,
          verificationToken, // Save the verification token
          isVerified: false,
      });

      // Save the user to the database
      await user.save();

      // Send verification email
      const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;
      const mailOptions = {
          to: email,
          from: `LAVORO <${process.env.EMAIL_USER || 'no-reply@example.com'}>`,
          subject: 'Email Verification',
          text: `Please verify your email by clicking the following link: ${verificationUrl}`,
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({ message: 'User registered successfully. Please check your email for verification.' });
  } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ error: 'An error occurred during signup. Please try again.' });
  }
};



exports.verifyEmail = async (req, res) => {
  try {
      const { token } = req.query;
      console.log('Verification token received:', token);

      const user = await User.findOne({ verificationToken: token });

      if (!user) {
          console.log('User not found for token:', token);
          return res.status(400).json({ error: 'Invalid or expired token.' });
      }

      if (user.isVerified) {
          console.log('User is already verified:', user.email);
          return res.status(200).json({ message: 'Email is already verified.' });
      }

      // Only delete the token *after* a successful response
      user.isVerified = true;
      await user.save();
      
      console.log('User verified successfully:', user.email);
      res.status(200).json({ message: 'Email verified successfully!' });

      // Remove the token AFTER responding
      user.verificationToken = undefined;
      await user.save();
  } catch (error) {
      console.error('Error verifying email:', error);
      res.status(500).json({ error: 'An error occurred while verifying your email. Please try again.' });
  }
};



  exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Sign-in attempt for email:', email);

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(400).json({ error: 'User not found.' });
        }

        console.log('User found:', user.email);

        // Check if the user is verified
        if (!user.isVerified) {
            console.log('User not verified:', email);
            return res.status(400).json({ error: 'Please verify your email before signing in.' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            console.log('Invalid password for email:', email);
            return res.status(400).json({ error: 'Invalid password.' });
        }

        console.log('Sign-in successful for email:', email);

        user.last_activity = Date.now();
        await user.save();

        // Set the user session
        req.session.user = user;
        console.log('Session created for user:', req.session.user);

        res.status(200).json(user); // Return user data
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'An error occurred during sign-in. Please try again.' });
    }
};


  

exports.getUserInfo = (req, res) => {
  if (req.session.user) {
      console.log('Session en cours : ', req.session.user.email); // Log session data
      res.json(req.session.user); // Send user info stored in session
  } else {
      res.status(401).json({ error: 'Not authenticated' });
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
      // Update the user's last_activity field (if session exists)
      if (req.session.user) {
          await User.findByIdAndUpdate(req.session.user._id, { last_activity: Date.now() });
      }

      // Destroy the session
      req.session.destroy((err) => {
          if (err) {
              console.error('Error destroying session:', err);
              return res.status(500).json({ message: 'Error logging out', error: err.message });
          }

          // Clear the session cookie after destroying the session
          res.clearCookie('connect.sid'); // Clears the session cookie

          // Send a success response
          res.status(200).json({ message: 'Logged out successfully' });
      });
  } catch (error) {
      console.error('Error updating last_activity:', error);
      res.status(500).json({ message: 'Error logging out', error: error.message });
  }
};




 exports.redirectIfAuthenticated= async (req, res, next) =>{
    if (req.session.user) {
      console.log('User already signed in. Redirecting to home.');
      return res.redirect('/home'); // Redirect to home if user is already authenticated
    }
    next();
  }




exports.redirectIfNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        console.log('User not authenticated. Redirecting to sign-in.');
        return res.redirect('/signin'); // Redirect to sign-in page if not authenticated
    }
    next(); // Proceed if the user is authenticated
};






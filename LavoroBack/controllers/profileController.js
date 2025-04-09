const User = require('../models/user');
const Role = require('../models/role');
const Notification = require('../models/Notification');
const AccountActivityLog = require('../models/accountActivityLog');
const bcrypt = require('bcrypt');
const fs = require('fs');
const qrcode = require('qrcode');
const speakeasy = require('speakeasy');
const jwt = require('jsonwebtoken');


// Fonction pour mettre à jour le profil de l'utilisateur
exports.updateProfile = async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    const userId = decoded._id; // Get user ID from token payload
    

    let imagePath = req.session.user?.image || ''; // Fallback if no session
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // If a new image is uploaded, update the image path
    if (req.file) {
      imagePath = '/imagesUser/' + req.file.filename;
    }

    // Handle base64 image (if sent as req.body.image)
    if (req.body.image && req.body.image.startsWith("data:image")) {
      const base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
      const filename = `public/imagesUser/${Date.now()}-captured.png`;
      fs.writeFileSync(filename, base64Data, "base64");
      imagePath = filename.replace("public", "");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (currentPassword && newPassword && confirmNewPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: 'Les nouveaux mots de passe ne correspondent pas' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password_hash = hashedPassword;
      await user.save();
    }

    const updateData = {
      image: imagePath,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone_number: req.body.phoneNumber,
    };

    if (user.password_hash) {
      updateData.password_hash = user.password_hash;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    await AccountActivityLog.create({
      userId: updatedUser._id,
      action: 'User Updated Profile',
    });

    res.status(200).json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Fonction pour envoyer une demande de suppression de compte
exports.requestDelete = async (req, res) => {
  try {
      const userSession = req.session.user;
      const userId = userSession._id;
      console.log(userId);
      const user = await User.findById(userId);

      console.log("user id", userId);

      if (!user) {
          return res.status(404).send("User not found");
      }

      if (user.role.RoleName === 'Admin') {
          return res.status(403).send("Admins do not need to request account deletion.");
      }

      const adminRole = await Role.findOne({ RoleName: "Admin" });

      if (!adminRole) {
        console.log("Aucun rôle 'Admin' trouvé.");
        return;
      }

      const admin = await User.findOne({ role: adminRole._id });

      if (admin) {
        console.log("Admin trouvé :", admin);
      } else {
        console.log("Aucun admin trouvé.");
      } 

       // Vérifier si une notification de suppression de compte existe déjà
      const existingNotification = await Notification.findOne({ 
          triggered_by: userId, 
          type: "delete_request" 
      });

      if (existingNotification) {
          return res.status(400).send("You already sent a deletion request.");
      }

      // Créer une notification pour l'admin
      const newNotification = new Notification({
          user_id: admin._id,
          notification_text: `User ${user.firstName} ${user.lastName} requested account deletion.`,
          type: "delete_request",
          triggered_by: userId
      });

      await newNotification.save();

      res.send("Account deletion request sent to admin.");

  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
};
exports.enable2FA = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a TOTP secret
    const secret = speakeasy.generateSecret({ length: 20 });
    console.log('New Secret:', secret.base32);

    // Save the secret to the user's record
    user.twoFactorSecret = secret.base32;
    await user.save();

    // Generate a QR code URL
    const otpauthUrl = secret.otpauth_url;

    // Convert the URL to a QR code image
    qrcode.toDataURL(otpauthUrl, (err, data_url) => {
      if (err) {
        return res.status(500).json({ error: 'Error generating QR code' });
      }

      // Return the QR code and secret to the frontend
      res.json({ qrCodeUrl: data_url, secret: secret.base32 });
    });
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    res.status(500).json({ message: error.message });
  }
};
exports.verify2FA = async (req, res) => {
  try {
    console.log('Request Body:', req.body); 
    const userId = req.session.user._id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const user = await User.findById(userId);

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ error: '2FA not enabled for this user' });
    }

    
    const currentToken = speakeasy.totp({
      secret: user.twoFactorSecret,
      encoding: 'base32',
    });
    console.log('Secret:', user.twoFactorSecret);
    console.log('Current TOTP Code:', currentToken);
    console.log('User Provided Token:', token);

    // Verify the TOTP code
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1, 
    });

    console.log('Is Valid:', verified);

    if (verified) {
      user.twoFactorEnabled = true; 
      await user.save();
      res.json({ message: '2FA verification successful' });
    } else {
      res.status(400).json({ error: 'Invalid 2FA code' });
    }
  } catch (error) {
    console.error('Error verifying 2FA:', error); 
    res.status(500).json({ message: error.message });
  }
};
exports.disable2FA = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.twoFactorSecret = null;
    user.twoFactorEnabled = false;
    await user.save();

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    res.status(500).json({ message: error.message });
  }
};

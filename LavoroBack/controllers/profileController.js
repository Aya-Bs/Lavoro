const User = require('../models/user');
const Role = require('../models/role');
const Notification = require('../models/Notification');
const AccountActivityLog = require('../models/accountActivityLog');
const bcrypt = require('bcrypt');
const fs = require('fs');
const qrcode = require('qrcode');
const speakeasy = require('speakeasy');


// // Fonction pour mettre à jour le profil de l'utilisateur
// exports.updateProfile = async (req, res) => {
//   try {
//     const userId = req.session.user._id;
//     let imagePath = req.session.user.image; 
//     const { currentPassword, newPassword, confirmNewPassword } = req.body;

//     // Si une nouvelle image est téléchargée, mettre à jour le chemin de l'image
//     if (req.file) {
//       imagePath = '/imagesUser/' + req.file.filename; 
//     }

//     console.log("req.body:", req.body);
//     console.log("req.file:", req.file);
//     console.log("imagePath",req.session.user.image);

//           // Handle base64 image (sent as req.body.image)
//           if (req.body.image && req.body.image.startsWith("data:image")) {
//             const base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
//             const filename = `public/imagesUser/${Date.now()}-captured.png`;
//             fs.writeFileSync(filename, base64Data, "base64");
//             imagePath = filename.replace("public", "");
//           }

//           console.log("hello");
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }

//     if (currentPassword && newPassword && confirmNewPassword) {
//       // Valider le mot de passe actuel
//       const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
//       if (!isPasswordValid) {
//         return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
//       }

//       // Vérifier que les nouveaux mots de passe correspondent
//       if (newPassword !== confirmNewPassword) {
//         return res.status(400).json({ message: 'Les nouveaux mots de passe ne correspondent pas' });
//       }

//       // Hacher le nouveau mot de passe
//       const hashedPassword = await bcrypt.hash(newPassword, 10);
//       user.password_hash = hashedPassword;
//       await user.save();
//     }

//     // Préparer l'objet de mise à jour
//     const updateData = {
//       image: imagePath,
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       phone_number: req.body.phoneNumber,
//     };

//     // Ajouter le mot de passe haché à l'objet de mise à jour uniquement si défini
//     if (user.password_hash) {
//       updateData.password_hash = user.password_hash;
//     }

//     console.log("updateData:", updateData);
//     // Mettre à jour l'utilisateur dans la base de données
//     const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

//     if (updatedUser) {
//       req.session.user = updatedUser;
//     } else {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     await AccountActivityLog.create({
//                userId: updatedUser._id,
//                action: 'User Updated Profile',
//              });

//     console.log("session user:", req.session.user);
//     req.session.user = updatedUser;

//     // Mettre à jour la session avec les nouvelles informations

//     // 

//     res.status(200).json({ message: 'Profil mis à jour avec succès' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// Update user profile (without password handling)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.session.user._id;
    let imagePath = req.session.user.image; 

    // Handle file upload
    if (req.file) {
      imagePath = '/imagesUser/' + req.file.filename; 
    }

    // Handle base64 image
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

    // Prepare update data
    const updateData = {
      image: imagePath,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone_number: req.body.phoneNumber,
    };

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update session and log activity
    req.session.user = updatedUser;
    await AccountActivityLog.create({
      userId: updatedUser._id,
      action: 'User Updated Profile',
    });

    res.status(200).json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Separate method for updating password
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'Tous les champs de mot de passe sont requis' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Validate current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'Les nouveaux mots de passe ne correspondent pas' });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashedPassword;
    await user.save();

    // req.session.user = user;
    // await AccountActivityLog.create({
    //   userId: user._id,
    //   action: 'User Changed Password',
    // });

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
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

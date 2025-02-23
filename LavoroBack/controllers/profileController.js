const User = require('../models/user');
const Role = require('../models/role');
const Notification = require('../models/Notification');
const AccountActivityLog = require('../models/accountActivityLog');
const bcrypt = require('bcrypt');



// Fonction pour mettre à jour le profil de l'utilisateur
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.session.user._id;
    let imagePath = req.session.user.image; 
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Si une nouvelle image est téléchargée, mettre à jour le chemin de l'image
    if (req.file) {
      imagePath = '/imagesUser/' + req.file.filename; 
    }

    // Si une image est capturée avec la webcam
    if (req.body.capturedImage) {
      // Convertir l'image Base64 en fichier
      const base64Data = req.body.capturedImage.replace(/^data:image\/png;base64,/, "");
      const filename = `public/imagesUser/${Date.now()}-captured.png`;
      require("fs").writeFileSync(filename, base64Data, 'base64');
      imagePath = filename.replace("public", ""); // Stocker sans "public/"
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (currentPassword && newPassword && confirmNewPassword) {
      // Valider le mot de passe actuel
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      }

      // Vérifier que les nouveaux mots de passe correspondent
      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: 'Les nouveaux mots de passe ne correspondent pas' });
      }

      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password_hash = hashedPassword;
      await user.save();
    }

    // Préparer l'objet de mise à jour
    const updateData = {
      image: imagePath,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone_number: req.body.phone_number,
    };

    // Ajouter le mot de passe haché à l'objet de mise à jour uniquement si défini
    if (user.password_hash) {
      updateData.password_hash = user.password_hash;
    }

    // Mettre à jour l'utilisateur dans la base de données
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mettre à jour la session avec les nouvelles informations
    req.session.user = updatedUser;
    await AccountActivityLog.create({
            userId: updatedUser._id,
            action: 'User Updated Profile',
          });

    // Rediriger vers la page de profil après la mise à jour
    res.redirect('/profiles/profile');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Fonction pour envoyer une demande de suppression de compte
exports.requestDelete = async (req, res) => {
  try {

      const userId = req.session.user._id;
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

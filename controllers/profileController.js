const User = require('../models/user');

// Fonction pour mettre à jour le profil de l'utilisateur
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.session.user._id;
    let imagePath = req.session.user.image; // Garder l'ancienne image par défaut

    // Si une nouvelle image est téléchargée, mettre à jour le chemin de l'image
    if (req.file) {
      imagePath = '/imagesUser/' + req.file.filename; // Chemin de la nouvelle image
    }

    // Si une image est capturée avec la webcam
    if (req.body.capturedImage) {
      // Convertir l'image Base64 en fichier
      const base64Data = req.body.capturedImage.replace(/^data:image\/png;base64,/, "");
      const filename = `public/imagesUser/${Date.now()}-captured.png`;
      require("fs").writeFileSync(filename, base64Data, 'base64');
      imagePath = filename.replace("public", ""); // Stocker sans "public/"
    }

    // Mettre à jour l'utilisateur dans la base de données
    const updatedUser = await User.findByIdAndUpdate(userId, {
      image: imagePath,           // Mise à jour de l'image (si nouvelle image téléchargée)
      firstName: req.body.firstName, // Mise à jour du prénom
      lastName: req.body.lastName,   // Mise à jour du nom de famille
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mettre à jour la session avec les nouvelles informations
    req.session.user = updatedUser;

    // Rediriger vers la page de profil après la mise à jour
    res.redirect('/profiles/profile');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



  
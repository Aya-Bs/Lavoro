const profileController = require('../controllers/profileController');
const upload = require('../middleware/upload'); // Importer le middleware d'upload
const express = require('express');
const router = express.Router();


router.get('/profile', async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      res.render('profile', { user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  // Update user profile
  router.post('/update', upload.single('image'), profileController.updateProfile);


  router.get('/update', async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.redirect('/users/signin');
        }
        res.render('updateProfile', { user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


  
module.exports = router;
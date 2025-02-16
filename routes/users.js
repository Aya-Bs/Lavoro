const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/upload'); // Middleware pour upload d'image

// Signup route with file upload
router.post('/signup', upload.single('image'), userController.signup);
router.get('/signup', (req, res) => {
    res.render("signup");
    });


router.post('/signin', userController.signin);

router.get('/signin', (req, res) => {
    res.render('signin'); // Render the signin.twig template
  });
  

  router.get('/check-email', userController.checkmail);

  router.post('/logout', userController.logout);

  router.get('/verify-email', userController.verifyEmail);

  router.post('/request-reset', userController.forgotPassword);

  router.get('/resetpassword', (req, res) => {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ message: 'Token manquant.' });
    }
  
    res.render('resetPassword.twig', { token });
  });
  
  
  router.post('/resetpassword', userController.resetPassword);

module.exports = router;

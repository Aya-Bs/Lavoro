const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/upload'); // Import the upload middleware
const setDefaultRole = require('../middleware/setDefaultRole');


// Signup route with file upload
router.post('/signup', setDefaultRole, upload.single('image'), userController.signup);

router.post('/signin', userController.signin);



router.get('/signin', userController.redirectIfAuthenticated, (req, res) => {
  res.render('signin');
});

router.get('/signup', userController.redirectIfAuthenticated, (req, res) => {
  res.render('signup');
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
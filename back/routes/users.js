const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/upload'); // Import the upload middleware

router.post('/signup', upload.single('image'), userController.signup);

router.get('/verify-email', userController.verifyEmail);

router.post('/signin', userController.signin);

  router.get('/check-email', userController.checkmail);

  router.post('/logout', userController.logout);


router.get('/me', userController.getUserInfo); // Route to get user info from session




router.get('/signin', userController.redirectIfAuthenticated, (req, res) => {
  res.render('signin'); // Render sign-up page
});

router.get('/signup', userController.redirectIfAuthenticated, (req, res) => {
  res.render('signup'); // Render sign-up page
});


router.get('/home', userController.redirectIfNotAuthenticated, (req, res) => {
  res.render('home'); 
});




module.exports = router;
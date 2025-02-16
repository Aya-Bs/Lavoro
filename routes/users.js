const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/upload'); // Import the upload middleware

router.post('/signup', upload.single('image'), userController.signup);



router.post('/signin', userController.signin);

  router.get('/check-email', userController.checkmail);

  router.post('/logout', userController.logout);

  router.get('/verify-email', userController.verifyEmail);




    router.get('/signin', userController.redirectIfAuthenticated, (req, res) => {
    res.render('signin');
  });
  
  router.get('/signup', userController.redirectIfAuthenticated, (req, res) => {
    res.render('signup');
  });


module.exports = router;
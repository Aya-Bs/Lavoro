const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/upload'); // Import the upload middleware
const setDefaultRole = require('../middleware/setDefaultRole');
const Task = require('../models/Task');

// router.post('/signup', upload.single('image'), userController.signup);

router.post('/signup', setDefaultRole, upload.single('image'), userController.signup);

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




router.get('/verify-email', userController.verifyEmail);
router.post('/request-reset', userController.forgotPassword);

router.get('/resetpassword', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token is missing.' });
  }

  res.status(200).json({ token });
});

router.post('/resetpassword', userController.resetPassword);

router.get('/mytasks', async (req, res) => {
  try {
      const userId = req.session.user._id; // Get the logged-in user's ID
      console.log("Fetching tasks for user ID:", userId); // Debugging

      // Fetch tasks assigned to the user
      const tasks = await Task.find({ assigned_to: userId });
      console.log("Tasks found:", tasks); // Debugging

      res.status(200).json(tasks); // Return the tasks
  } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "An error occurred while fetching tasks." });
  }
});



module.exports = router;
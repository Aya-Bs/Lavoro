
const express = require('express');
const router = express.Router();
const User = require('../models/user');  
const Role = require('../models/role');  

/*
router.get('/home', (req, res) => {
  // Check if the user is authenticated
  if (!req.session.user) {
    return res.redirect('/users/signin'); // Redirect to sign-in if not authenticated
  }

  // Render the home page for authenticated users
  res.render('home', { user: req.session.user });
});
*/


router.get('/home', async (req, res) => {
  // Check if the user is authenticated
  if (!req.session.user) {
    return res.redirect('/users/signin'); // Redirect to sign-in if not authenticated
  }

  try {
    // Fetch the user from the database and populate the role
    const user = await User.findById(req.session.user._id).populate('role', 'RoleName');
    
    // Check if user exists
    if (!user) {
      return res.redirect('/users/signin');  // Redirect if user is not found
    }

    // Add populated role to session or use directly in the response
    req.session.user = user;  // Optionally update session with full user data

    // Render the home page with the populated user data
    res.render('home', { user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;


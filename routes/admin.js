const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); // Import the controller

// Route for the admin dashboard
router.get('/dashboard', adminController.getAdminDashboard);
router.post('/update-role/:userId', adminController.updateUserRole);


module.exports = router;

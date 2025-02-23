const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); // Import the controller

// Route for the admin dashboard
router.get('/dashboard', adminController.getAdminDashboard);
router.post('/update-role/:userId', adminController.updateUserRole);
router.get('/user-activity/:userId', adminController.getUserActivity); 



module.exports = router;

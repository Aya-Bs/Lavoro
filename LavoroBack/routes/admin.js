const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); // Import the controller

// Route for the admin dashboard
router.get('/dashboard', adminController.getAdminDashboard);

// Route to update a user's role
router.post('/update-role/:userId', adminController.updateUserRole);

// Route to fetch a user's activity logs
router.get('/user-activity/:userId', adminController.getUserActivity);
router.get('/delete-requests', adminController.getDeleteRequests);
router.post('/handle-delete-request', adminController.handleDeleteRequest);


module.exports = router;

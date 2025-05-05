const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Create notification
router.post('/create', notificationController.createNotification);

// Get user notifications
router.get('/user', notificationController.getUserNotifications);

// Mark notification as read
router.patch('/:notificationId/read', notificationController.markNotificationAsRead);

module.exports = router;
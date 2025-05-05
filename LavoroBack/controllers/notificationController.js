const notificationUtils = require('../utils/notification');
const Notification = require('../models/notif');

exports.createNotification = async (req, res) => {
    try {
        const { userId, task } = req.body;

        if (!userId || !task) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const notification = await notificationUtils.createTaskAssignmentNotification(userId, task);

        res.status(201).json({
            success: true,
            data: notification,
            message: 'Notification created successfully'
        });
    } catch (error) {
        console.error('Error in createNotification:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating notification'
        });
    }
};

exports.getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.query; // Get userId from query parameters

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const notifications = await Notification.find({ user_id: userId })
            .sort({ created_at: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Error in getUserNotifications:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching notifications'
        });
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { userId } = req.body; // Get userId from request body

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, user_id: userId },
            { 
                is_read: true,
                read_at: new Date()
            },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            data: notification,
            message: 'Notification marked as read'
        });
    } catch (error) {
        console.error('Error in markNotificationAsRead:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error marking notification as read'
        });
    }
}; 
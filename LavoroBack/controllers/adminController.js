const User = require('../models/user'); 
const Role = require('../models/role'); 
const AccountActivityLog = require('../models/accountActivityLog');
const Notification = require('../models/Notification');


exports.getAdminDashboard = async (req, res) => {
  try {
    // Check if the user is authenticated and is an admin
    if (!req.session.user || req.session.user.role.RoleName !== 'Admin') {
      return res.status(403).json({ error: 'Unauthorized. Only admins can access this page.' });
    }

    // Fetch all users and populate their roles
    const users = await User.find().populate('role', 'RoleName');
    const roles = await Role.find();

    // Return the data as JSON
    res.status(200).json({ users, roles });
  } catch (error) {
    console.error('Error fetching users for admin dashboard:', error);
    res.status(500).json({ error: 'An error occurred while fetching user data.' });
  }
};
  
// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    // Check if the user is an admin
    if (!req.session.user || req.session.user.role.RoleName !== 'Admin') {
      return res.status(403).json({ error: 'Unauthorized. Only admins can update roles.' });
    }

    const { userId } = req.params;
    const { role } = req.body; // This will be the role _id from the request

    if (!role) {
      return res.status(400).json({ error: 'Role is required.' });
    }

    // Update the user's role in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: role },
      { new: true }
    ).populate('role'); // Populate the role to get the RoleName

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Return the updated user data
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Error updating role.' });
  }
};


exports.getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user's activity logs
    const activityLogs = await AccountActivityLog.find({ userId })
      .sort({ timestamp: -1 }) // Sort by most recent first
      .populate('userId', 'firstName lastName email'); // Populate user details

    // Return the activity logs as JSON
    res.status(200).json({ activityLogs });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: 'Error fetching activity logs.' });
  }
};

exports.getDeleteRequests = async (req, res) => {
  try {
    const deleteRequests = await Notification.find({ type: 'delete_request', status: 'pending' })
      .populate('triggered_by', 'firstName lastName email'); // Populate user details

    console.log('Raw delete requests:', deleteRequests); // Log the raw data

    res.status(200).json(deleteRequests);
  } catch (error) {
    console.error('Error fetching delete requests:', error);
    res.status(500).json({ error: 'Error fetching delete requests.' });
  }
};

exports.handleDeleteRequest = async (req, res) => {
  try {
    const { notificationId, action } = req.body; // action: 'approve' or 'reject'
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    if (notification.status !== 'pending') {
      return res.status(400).json({ error: 'This request has already been processed.' });
    }

    if (action === 'approve') {
      // Delete the user account
      await User.findByIdAndDelete(notification.triggered_by);
      notification.status = 'approved';
    } else if (action === 'reject') {
      notification.status = 'rejected';
    } else {
      return res.status(400).json({ error: 'Invalid action.' });
    }

    await notification.save();
    res.status(200).json({ message: `Request ${action}ed successfully.` });
  } catch (error) {
    console.error('Error handling delete request:', error);
    res.status(500).json({ error: 'Error handling delete request.' });
  }
};
const User = require('../models/user'); 
const Role = require('../models/role'); 
const AccountActivityLog = require('../models/accountActivityLog');


exports.getAdminDashboard = async (req, res) => {
    try {
      // Check if the user is authenticated and is an admin
      if (!req.session.user || req.session.user.role.RoleName !== 'Admin') {
        return res.redirect('/users/signin'); // Redirect to sign-in if not authenticated or not admin
      }
  
      // Fetch all users to display in the admin dashboard
      const users = await User.find().populate('role', 'RoleName'); 
      const roles = await Role.find();
      res.render('admin-dashboard', { users , roles});
    } catch (error) {
      console.error('Error fetching users for admin dashboard:', error);
      res.status(500).render('admin-dashboard', { error: 'An error occurred while fetching user data.' });
    }
  };
  
// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    // Check if the user is an admin
    if (!req.session.user || req.session.user.role.RoleName !== 'Admin') {
      return res.redirect('/users/signin');
    }

    const { userId } = req.params;
    const { role } = req.body; // This will be the role _id from the form

    if (!role) {
      return res.status(400).send('Role is required');
    }

    // Update the user's role in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: role },
      { new: true }
    ).populate('role'); // Populate the role to get the RoleName

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    // Emit a WebSocket event to notify the affected user
    const io = req.app.get('io');
    io.emit('role-updated', {
      userId: updatedUser._id,
      role: updatedUser.role,
    });

    // Redirect back to the admin dashboard
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).send('Error updating role.');
  }
};


exports.getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user's activity logs
    const activityLogs = await AccountActivityLog.find({ userId })
      .sort({ timestamp: -1 }) // Sort by most recent first
      .populate('userId', 'firstName lastName email'); // Populate user details

    // Log the activity logs for debugging
    console.log('Activity Logs:', activityLogs);

    // Render the account-log template with the logs
    res.render('account-log', { activityLogs });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).render('error', { message: 'Error fetching activity logs' });
  }
};
const User = require('../models/user'); // Assuming the User model is located here
const Role = require('../models/role'); // Assuming the User model is located here

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
      const updatedUser = await User.findByIdAndUpdate(userId, { role: role }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).send('User not found');
      }
  
      // Redirect back to the admin dashboard
      res.redirect('/admin/dashboard');
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).send('Error updating role.');
    }
  };
  
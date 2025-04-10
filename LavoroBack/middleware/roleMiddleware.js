const Role = require('../models/role'); 
const User = require('../models/user'); 

// authMiddleware.js
const checkPermission = (requiredPermissions) => {
    return (req, res, next) => {
      const userPermissions = req.session.user?.role?.Permissions || [];
      
      // Check if user has at least one of the required permissions
      const hasPermission = requiredPermissions.some(permission => 
        userPermissions.includes(permission)
      );
      
      if (!hasPermission) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      next();
    };
  };
  
  module.exports = { checkPermission };

module.exports = { checkPermission };

module.exports = function requireTeamManager(req, res, next) {
    if (req.user && req.user.role === 'TeamManager') {
      return next();
    } else {
      return res.status(403).send('Access denied: Only Team Managers can access this page.');
    }
  };
  
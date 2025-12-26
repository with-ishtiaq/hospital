// role.js - Role-based access control middleware
module.exports = (role) => (req, res, next) => {
  // Assume req.user.role is set after auth
  if (req.user && req.user.role === role) return next();
  return res.status(403).json({ error: 'Forbidden' });
};

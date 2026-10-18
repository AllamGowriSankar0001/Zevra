const User = require('../models/User');

async function requireAdmin(req, res, next) {
  if (!req.session?.userId)
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  try {
    const user = await User.findById(req.session.userId).select('role isActive');
    if (!user || !user.isActive)
      return res.status(401).json({ success: false, message: 'Session invalid.' });
    if (user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    req.adminUser = user;
    next();
  } catch (err) { next(err); }
}

module.exports = { requireAdmin };

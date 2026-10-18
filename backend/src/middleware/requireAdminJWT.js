const jwt  = require('jsonwebtoken');
const SECRET = process.env.ADMIN_JWT_SECRET || 'admin_secret_dev';

function requireAdminJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'Admin token required.' });
  try {
    const payload = jwt.verify(auth.slice(7), SECRET);
    if (payload.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    req.adminUser = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired admin token.' });
  }
}

module.exports = { requireAdminJWT };

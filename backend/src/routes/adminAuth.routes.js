const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const SECRET = process.env.ADMIN_JWT_SECRET || 'admin_secret_dev';

// POST /api/v1/admin-auth/login  — returns a short-lived JWT for admin panel
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required.' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user || !user.isActive || user.role !== 'admin')
      return res.status(401).json({ success: false, message: 'Invalid credentials or not an admin.' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json({ success: false, message: 'Invalid credentials or not an admin.' });

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, fullName: user.fullName, email: user.email },
      SECRET,
      { expiresIn: '8h' }
    );
    res.json({ success: true, token, user: user.toSafeObject() });
  } catch (err) { next(err); }
});

// GET /api/v1/admin-auth/me  — verify token
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'No token.' });
  try {
    const payload = jwt.verify(auth.slice(7), SECRET);
    res.json({ success: true, user: payload });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
});

module.exports = router;

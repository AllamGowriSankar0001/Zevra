const bcrypt   = require('bcryptjs');
const crypto   = require('crypto');
const User     = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');

// POST /api/v1/auth/register
async function register(req, res, next) {
  try {
    const { fullName, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ fullName, email, phone, passwordHash });

    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.userId = user._id.toString();
      res.status(201).json({ success: true, message: 'Account created successfully.', data: { user: user.toSafeObject() } });
    });
  } catch (err) { next(err); }
}

// POST /api/v1/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !user.isActive)
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });

    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.userId = user._id.toString();
      res.json({ success: true, message: 'Logged in successfully.', data: { user: user.toSafeObject() } });
    });
  } catch (err) { next(err); }
}

// GET /api/v1/auth/me
async function me(req, res, next) {
  try {
    if (!req.session?.userId) {
      return res.json({ success: true, data: { user: null } });
    }
    const user = await User.findById(req.session.userId);
    if (!user || !user.isActive) {
      req.session.userId = null;
      return res.json({ success: true, data: { user: null } });
    }
    res.json({ success: true, data: { user: user.toSafeObject() } });
  } catch (err) { next(err); }
}

// POST /api/v1/auth/logout
function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie(process.env.SESSION_NAME || 'zevra.sid');
    res.json({ success: true, message: 'Logged out successfully.' });
  });
}

// POST /api/v1/auth/forgot-password
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isActive)
      return res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });

    await PasswordResetToken.deleteMany({ user: user._id });
    const rawToken  = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await PasswordResetToken.create({ user: user._id, tokenHash, expiresAt });
    console.info(`[DEV] Password reset token for ${email}: ${rawToken}`);
    res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
  } catch (err) { next(err); }
}

// POST /api/v1/auth/reset-password
async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const record = await PasswordResetToken.findOne({ tokenHash, usedAt: null, expiresAt: { $gt: new Date() } });
    if (!record)
      return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired.' });

    const passwordHash = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(record.user, { passwordHash });
    record.usedAt = new Date();
    await record.save();
    res.json({ success: true, message: 'Password reset successfully. Please log in.' });
  } catch (err) { next(err); }
}

module.exports = { register, login, me, logout, forgotPassword, resetPassword };

/**
 * ZEVRA — Auth Backend
 * Simple Express server with in-memory user store.
 * Replace with a real database (MongoDB, PostgreSQL, etc.) in production.
 *
 * Endpoints:
 *   POST /api/auth/signup  — create account
 *   POST /api/auth/login   — login, returns JWT
 *   GET  /api/auth/me      — get current user (requires JWT)
 */

const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4001;
const JWT_SECRET = process.env.JWT_SECRET || 'zevra-dev-secret-change-in-production';

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cors({ origin: 'http://localhost:5174', credentials: true }));
app.use(express.json());

// ── In-memory user store (replace with DB) ─────────────────────
const users = [];

// ── Middleware: verify JWT ──────────────────────────────────────
function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided.' });
  }
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// ── POST /api/auth/signup ───────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim())
    return res.status(400).json({ error: 'Name is required.' });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'A valid email is required.' });
  if (!password || password.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists)
    return res.status(409).json({ error: 'An account with this email already exists.' });

  const hash = await bcrypt.hash(password, 12);
  const user = { id: Date.now().toString(), name: name.trim(), email: email.toLowerCase(), hash };
  users.push(user);

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// ── POST /api/auth/login ────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  const user = users.find(u => u.email === email.toLowerCase());
  if (!user)
    return res.status(401).json({ error: 'Incorrect email or password.' });

  const valid = await bcrypt.compare(password, user.hash);
  if (!valid)
    return res.status(401).json({ error: 'Incorrect email or password.' });

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// ── GET /api/auth/me ────────────────────────────────────────────
app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// ── Health check ────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', message: 'ZEVRA API running' }));

app.listen(PORT, () => console.log(`ZEVRA API → http://localhost:${PORT}`));

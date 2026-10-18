require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express      = require('express');
const cors         = require('cors');
const session      = require('express-session');
const MongoStore   = require('connect-mongo');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// ── CORS ────────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5174').split(',').map(s => s.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// ── Body parsing ────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// ── Session ─────────────────────────────────────────────────────
app.use(session({
  name:   process.env.SESSION_NAME  || 'zevra.sid',
  secret: process.env.SESSION_SECRET || 'change_me_in_production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: parseInt(process.env.SESSION_MAX_AGE_MS || '604800000') / 1000,
    autoRemove: 'native',
  }),
  cookie: {
    httpOnly: true,
    secure:   false,
    sameSite: 'lax',
    maxAge:   parseInt(process.env.SESSION_MAX_AGE_MS || '604800000'),
    domain:   'localhost',
  },
}));

// ── Rate limit ──────────────────────────────────────────────────
app.use('/api', generalLimiter);

// ── Routes ──────────────────────────────────────────────────────
app.use('/api/v1/auth',     require('./routes/auth.routes'));
app.use('/api/v1/users',    require('./routes/user.routes'));
app.use('/api/v1/products', require('./routes/product.routes'));
app.use('/api/v1/cart',     require('./routes/cart.routes'));
app.use('/api/v1/wishlist', require('./routes/wishlist.routes'));
app.use('/api/v1/orders',   require('./routes/order.routes'));
app.use('/api/v1/admin-auth', require('./routes/adminAuth.routes'));
app.use('/api/v1/admin',      require('./routes/admin.routes'));

app.get('/api/health', (_, res) => res.json({ success: true, message: 'ZEVRA API is running.' }));

// ── Error handling ───────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express      = require('express');
const cors         = require('cors');
const session      = require('express-session');
const MongoStore   = require('connect-mongo');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

app.set('trust proxy', 1);

// ── CORS ────────────────────────────────────────────────────────
const configuredOrigins = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...configuredOrigins]));

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g., server-to-server, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
}));

// ── Body parsing ────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// ── Session ─────────────────────────────────────────────────────
const isProduction = process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true';

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
    secure:   isProduction,
    sameSite: isProduction ? 'none' : (process.env.COOKIE_SAME_SITE || 'lax'),
    maxAge:   parseInt(process.env.SESSION_MAX_AGE_MS || '604800000'),
    ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
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

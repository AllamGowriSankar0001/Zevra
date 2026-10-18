require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { connectDB } = require('./config/database');
const ensureDefaultCategories = require('./utils/ensureDefaultCategories');
const app = require('./app');

const PORT = parseInt(process.env.PORT) || 4001;

async function start() {
  try {
    await connectDB();
    await ensureDefaultCategories();
    app.listen(PORT, () => {
      console.log(`✅ ZEVRA API → http://localhost:${PORT}/api/health`);
      console.log(`   Environment: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();

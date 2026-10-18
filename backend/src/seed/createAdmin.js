/**
 * Create an initial admin user.
 * Usage: node src/seed/createAdmin.js
 * Set ADMIN_EMAIL and ADMIN_PASSWORD env vars or edit defaults below.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');

const EMAIL    = process.env.ADMIN_EMAIL    || 'admin@zevra.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345';
const NAME     = process.env.ADMIN_NAME     || 'ZEVRA Admin';

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const exists = await User.findOne({ email: EMAIL });
  if (exists) {
    if (exists.role !== 'admin') {
      exists.role = 'admin';
      await exists.save();
      console.log(`✅ Upgraded existing user ${EMAIL} to admin.`);
    } else {
      console.log(`ℹ️  Admin ${EMAIL} already exists.`);
    }
  } else {
    const passwordHash = await bcrypt.hash(PASSWORD, 12);
    await User.create({ fullName: NAME, email: EMAIL, passwordHash, role: 'admin', isEmailVerified: true });
    console.log(`✅ Admin created: ${EMAIL}`);
    console.log(`   Password: ${PASSWORD}  ← change this immediately`);
  }
  await mongoose.disconnect();
}

createAdmin().catch(err => { console.error(err.message); process.exit(1); });

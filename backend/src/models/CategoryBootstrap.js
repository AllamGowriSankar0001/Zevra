const mongoose = require('mongoose');

const categoryBootstrapSchema = new mongoose.Schema({
  _id: { type: String, default: 'default-categories' },
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CategoryBootstrap', categoryBootstrapSchema);

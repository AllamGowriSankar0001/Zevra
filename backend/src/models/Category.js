const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, trim: true, default: '' },
  sizeOptions: { type: [String], default: [] },
  imageUrl:    { type: String, trim: true, default: '' },
  parent:      { type: String, default: null, lowercase: true, trim: true },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

categorySchema.index({ parent: 1 });

module.exports = mongoose.model('Category', categorySchema);

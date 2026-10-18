const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url:       { type: String, required: true },
  alt:       { type: String, default: '' },
  isPrimary: { type: Boolean, default: false },
}, { _id: false });

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex:  { type: String, required: true },
  sku:  { type: String },
}, { _id: false });

const variantSchema = new mongoose.Schema({
  sku:      { type: String },
  color:    { type: String },
  size:     { type: String },
  stock:    { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: true },
}, { _id: false });

const productSchema = new mongoose.Schema({
  slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  name:        { type: String, required: true, trim: true },
  category:    { type: String, required: true, lowercase: true, trim: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true, min: 0 },
  images:      [imageSchema],
  colors:      [colorSchema],
  sizes:       [{ type: String }],
  variants:    [variantSchema],
  stock:       { type: Number, default: 0, min: 0 },
  isActive:    { type: Boolean, default: true },
  isAdminCreated: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);

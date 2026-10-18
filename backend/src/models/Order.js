const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName:  { type: String, required: true },
  productImage: { type: String, default: '' },
  sku:          { type: String, default: '' },
  color:        { type: String, default: '' },
  size:         { type: String, default: '' },
  quantity:     { type: Number, required: true, min: 1 },
  unitPrice:    { type: Number, required: true, min: 0 },
  lineTotal:    { type: Number, required: true, min: 0 },
}, { _id: false });

const addressSnapshotSchema = new mongoose.Schema({
  recipientName: String, phone: String, addressLine1: String,
  addressLine2:  String, city:  String, state:        String,
  postalCode:    String, country: { type: String, default: 'India' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber:    { type: String, required: true, unique: true },
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:          [orderItemSchema],
  shippingAddress:[addressSnapshotSchema],
  subtotal:       { type: Number, required: true, min: 0 },
  shippingFee:    { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalAmount:    { type: Number, required: true, min: 0 },
  currency:       { type: String, default: 'INR' },
  status:         { type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled'], default: 'pending' },
  paymentStatus:  { type: String, enum: ['not_applicable','pending','paid','failed','refunded'], default: 'not_applicable' },
  paymentMethod:  { type: String },
  placedAt:       { type: Date },
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label:         { type: String, trim: true, default: 'Home' },
  recipientName: { type: String, required: true, trim: true },
  phone:         { type: String, required: true, trim: true },
  addressLine1:  { type: String, required: true, trim: true },
  addressLine2:  { type: String, trim: true },
  landmark:      { type: String, trim: true },
  city:          { type: String, required: true, trim: true },
  state:         { type: String, required: true, trim: true },
  postalCode:    { type: String, required: true, trim: true },
  country:       { type: String, default: 'India', trim: true },
  isDefault:     { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  fullName:        { type: String, required: true, trim: true },
  email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:           { type: String, trim: true },
  passwordHash:    { type: String, required: true, select: false },
  role:            { type: String, enum: ['customer', 'admin'], default: 'customer' },
  isActive:        { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  defaultAddressId:{ type: mongoose.Schema.Types.ObjectId, default: null },
  addresses:       [addressSchema],
}, { timestamps: true });

// Never return passwordHash by default
userSchema.methods.toSafeObject = function () {
  return {
    id:              this._id,
    fullName:        this.fullName,
    email:           this.email,
    phone:           this.phone,
    role:            this.role,
    isEmailVerified: this.isEmailVerified,
    defaultAddressId:this.defaultAddressId,
    addresses:       this.addresses,
    createdAt:       this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);

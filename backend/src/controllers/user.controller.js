const User = require('../models/User');

const ALLOWED_FIELDS = ['fullName', 'phone'];

// GET /api/v1/users/me
async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: { user: user.toSafeObject() } });
  } catch (err) { next(err); }
}

// PATCH /api/v1/users/me
async function updateProfile(req, res, next) {
  try {
    const updates = {};
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    const user = await User.findByIdAndUpdate(req.session.userId, updates, { new: true, runValidators: true });
    res.json({ success: true, message: 'Profile updated.', data: { user: user.toSafeObject() } });
  } catch (err) { next(err); }
}

// GET /api/v1/users/me/addresses
async function getAddresses(req, res, next) {
  try {
    const user = await User.findById(req.session.userId);
    res.json({ success: true, data: { addresses: user.addresses } });
  } catch (err) { next(err); }
}

// POST /api/v1/users/me/addresses
async function addAddress(req, res, next) {
  try {
    const user = await User.findById(req.session.userId);
    user.addresses.push(req.body);
    if (user.addresses.length === 1) {
      user.addresses[0].isDefault = true;
      user.defaultAddressId = user.addresses[0]._id;
    }
    await user.save();
    res.status(201).json({ success: true, message: 'Address added.', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
}

// PATCH /api/v1/users/me/addresses/:addressId
async function updateAddress(req, res, next) {
  try {
    const user = await User.findById(req.session.userId);
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ success: false, message: 'Address not found.' });
    Object.assign(addr, req.body);
    await user.save();
    res.json({ success: true, message: 'Address updated.', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
}

// DELETE /api/v1/users/me/addresses/:addressId
async function deleteAddress(req, res, next) {
  try {
    const user = await User.findById(req.session.userId);
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ success: false, message: 'Address not found.' });
    addr.deleteOne();
    if (user.defaultAddressId?.toString() === req.params.addressId) {
      const remaining = user.addresses[0];
      user.defaultAddressId = remaining ? remaining._id : null;
      if (remaining) remaining.isDefault = true;
    }
    await user.save();
    res.json({ success: true, message: 'Address deleted.', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
}

// PATCH /api/v1/users/me/addresses/:addressId/default
async function setDefaultAddress(req, res, next) {
  try {
    const user = await User.findById(req.session.userId);
    user.addresses.forEach(a => { a.isDefault = a._id.toString() === req.params.addressId; });
    user.defaultAddressId = req.params.addressId;
    await user.save();
    res.json({ success: true, message: 'Default address updated.', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
}

module.exports = { getProfile, updateProfile, getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress };

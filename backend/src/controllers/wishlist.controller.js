const mongoose  = require('mongoose');
const Wishlist  = require('../models/Wishlist');

// GET /api/v1/wishlist
async function getWishlist(req, res, next) {
  try {
    const items = await Wishlist.find({ user: req.session.userId })
      .populate({ path: 'product', select: 'name slug images price isActive colors sizes' })
      .sort({ createdAt: -1 }).lean();
    const active = items.filter(i => i.product && i.product.isActive);
    res.json({ success: true, data: { items: active } });
  } catch (err) { next(err); }
}

// POST /api/v1/wishlist/items
async function addItem(req, res, next) {
  try {
    const { productId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    try {
      await Wishlist.create({ user: req.session.userId, product: productId });
    } catch (e) {
      if (e.code === 11000) return res.json({ success: true, message: 'Already in wishlist.' });
      throw e;
    }
    res.status(201).json({ success: true, message: 'Added to wishlist.' });
  } catch (err) { next(err); }
}

// DELETE /api/v1/wishlist/items/:productId
async function removeItem(req, res, next) {
  try {
    await Wishlist.findOneAndDelete({ user: req.session.userId, product: req.params.productId });
    res.json({ success: true, message: 'Removed from wishlist.' });
  } catch (err) { next(err); }
}

module.exports = { getWishlist, addItem, removeItem };

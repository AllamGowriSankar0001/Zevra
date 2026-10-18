const mongoose = require('mongoose');
const Cart    = require('../models/Cart');
const Product = require('../models/Product');

async function getPopulatedCart(userId) {
  const cart = await Cart.findOne({ user: userId }).populate({ path: 'items.product', select: 'name slug images price isActive' });
  if (!cart) return { items: [], subtotal: 0 };
  const validItems = cart.items.filter(i => i.product && i.product.isActive);
  const subtotal   = validItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  return { items: validItems, subtotal };
}

// GET /api/v1/cart
async function getCart(req, res, next) {
  try {
    const data = await getPopulatedCart(req.session.userId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

// POST /api/v1/cart/items
async function addItem(req, res, next) {
  try {
    const { productId, quantity, color, size, sku } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ success: false, message: 'Invalid product ID.' });

    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    let cart = await Cart.findOne({ user: req.session.userId });
    if (!cart) cart = new Cart({ user: req.session.userId, items: [] });

    const existing = cart.items.find(i =>
      i.product.toString() === productId && i.color === color && i.size === size
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, color: color || '', size: size || '', sku: sku || '' });
    }
    await cart.save();
    const data = await getPopulatedCart(req.session.userId);
    res.json({ success: true, message: 'Item added to cart.', data });
  } catch (err) { next(err); }
}

// PATCH /api/v1/cart/items/:itemId
async function updateItem(req, res, next) {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.session.userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    item.quantity = quantity;
    await cart.save();
    const data = await getPopulatedCart(req.session.userId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

// DELETE /api/v1/cart/items/:itemId
async function removeItem(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.session.userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    item.deleteOne();
    await cart.save();
    const data = await getPopulatedCart(req.session.userId);
    res.json({ success: true, message: 'Item removed.', data });
  } catch (err) { next(err); }
}

// DELETE /api/v1/cart
async function clearCart(req, res, next) {
  try {
    await Cart.findOneAndUpdate({ user: req.session.userId }, { items: [] });
    res.json({ success: true, message: 'Cart cleared.', data: { items: [], subtotal: 0 } });
  } catch (err) { next(err); }
}

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };

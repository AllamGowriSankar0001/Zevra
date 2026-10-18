const mongoose = require('mongoose');
const Order    = require('../models/Order');

// GET /api/v1/orders
async function getOrders(req, res, next) {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const [orders, total] = await Promise.all([
      Order.find({ user: req.session.userId }).sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit).lean(),
      Order.countDocuments({ user: req.session.userId }),
    ]);
    res.json({ success: true, data: { orders, pagination: { page, limit, total, pages: Math.ceil(total/limit) } } });
  } catch (err) { next(err); }
}

// GET /api/v1/orders/:orderId
async function getOrder(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId))
      return res.status(400).json({ success: false, message: 'Invalid order ID.' });
    const order = await Order.findOne({ _id: req.params.orderId, user: req.session.userId }).lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: { order } });
  } catch (err) { next(err); }
}

module.exports = { getOrders, getOrder };

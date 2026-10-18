const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/order.controller');
const { requireAuth } = require('../middleware/requireAuth');

router.get('/',          requireAuth, ctrl.getOrders);
router.get('/:orderId',  requireAuth, ctrl.getOrder);

module.exports = router;

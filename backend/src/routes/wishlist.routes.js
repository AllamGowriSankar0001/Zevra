const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/wishlist.controller');
const { requireAuth } = require('../middleware/requireAuth');

router.get(   '/',            requireAuth, ctrl.getWishlist);
router.post(  '/items',       requireAuth, ctrl.addItem);
router.delete('/items/:productId', requireAuth, ctrl.removeItem);

module.exports = router;

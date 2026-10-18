const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/cart.controller');
const { requireAuth }  = require('../middleware/requireAuth');
const { validate, addItemSchema, updateItemSchema } = require('../validators/cart.validators');

router.get(   '/',            requireAuth,                          ctrl.getCart);
router.post(  '/items',       requireAuth, validate(addItemSchema), ctrl.addItem);
router.patch( '/items/:itemId', requireAuth, validate(updateItemSchema), ctrl.updateItem);
router.delete('/items/:itemId', requireAuth,                        ctrl.removeItem);
router.delete('/',            requireAuth,                          ctrl.clearCart);

module.exports = router;

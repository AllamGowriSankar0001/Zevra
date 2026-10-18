const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/product.controller');

router.get('/categories', ctrl.getCategories);
router.get('/',           ctrl.listProducts);
router.get('/:slug',      ctrl.getProduct);

module.exports = router;

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/admin.controller');
const { requireAdminJWT } = require('../middleware/requireAdminJWT');

// All admin routes require valid admin JWT
router.use(requireAdminJWT);

// Dashboard
router.get('/dashboard', ctrl.getDashboard);

// Products
router.get( '/products',            ctrl.listProducts);
router.post('/products',            ctrl.createProduct);
router.get( '/products/:id',        ctrl.getProduct);
router.patch('/products/:id',       ctrl.updateProduct);
router.patch('/products/:id/status',ctrl.updateProductStatus);

// Categories
router.get(   '/categories',     ctrl.getCategories);
router.post(  '/categories',     ctrl.createCategory);
router.patch( '/categories/:id', ctrl.updateCategory);
router.delete('/categories/:id', ctrl.deleteCategory);

// Inventory
router.get(  '/inventory',                                         ctrl.getInventory);
router.patch('/inventory/:productId/stock',                        ctrl.updateProductStock);
router.patch('/inventory/:productId/variants/:variantIndex',       ctrl.updateVariantStock);

// Customers
router.get(  '/customers',           ctrl.listCustomers);
router.get(  '/customers/:id',       ctrl.getCustomer);
router.patch('/customers/:id',       ctrl.updateCustomer);
router.delete('/customers/:id',      ctrl.deleteCustomer);
router.patch('/customers/:id/status',ctrl.updateCustomerStatus);

// Orders
router.get(  '/orders',              ctrl.listOrders);
router.get(  '/orders/:id',          ctrl.getOrder);
router.patch('/orders/:id/status',   ctrl.updateOrderStatus);

module.exports = router;

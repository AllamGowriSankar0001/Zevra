const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/user.controller');
const { requireAuth } = require('../middleware/requireAuth');

router.get(   '/me',                                    requireAuth, ctrl.getProfile);
router.patch( '/me',                                    requireAuth, ctrl.updateProfile);
router.get(   '/me/addresses',                          requireAuth, ctrl.getAddresses);
router.post(  '/me/addresses',                          requireAuth, ctrl.addAddress);
router.patch( '/me/addresses/:addressId',               requireAuth, ctrl.updateAddress);
router.delete('/me/addresses/:addressId',               requireAuth, ctrl.deleteAddress);
router.patch( '/me/addresses/:addressId/default',       requireAuth, ctrl.setDefaultAddress);

module.exports = router;

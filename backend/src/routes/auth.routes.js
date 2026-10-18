const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimiter');
const { requireAuth } = require('../middleware/requireAuth');
const { validate, registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validators/auth.validators');

router.post('/register',       authLimiter, validate(registerSchema),       ctrl.register);
router.post('/login',          authLimiter, validate(loginSchema),           ctrl.login);
router.get( '/me',                                                                ctrl.me);
router.post('/logout',         requireAuth,                                   ctrl.logout);
router.post('/forgot-password',authLimiter, validate(forgotPasswordSchema), ctrl.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema),  ctrl.resetPassword);

module.exports = router;

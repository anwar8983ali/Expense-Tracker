const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const catchAsync = require('../utils/catchAsync');
const validate = require('../middleware/validateMiddleware');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../schemas/authSchema');
const authController = require('../controllers/authController');

// Slow down brute-force attempts against login/register/password-reset.
// 10 attempts per 15 minutes per IP is generous for real users, painful for scripts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, validate(registerSchema), catchAsync(authController.register));
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/status', authController.status);

router.post(
  '/forgot-password',
  authLimiter,
  validate(forgotPasswordSchema),
  catchAsync(authController.forgotPassword)
);
router.post(
  '/reset-password',
  authLimiter,
  validate(resetPasswordSchema),
  catchAsync(authController.resetPassword)
);

module.exports = router;

const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const validate = require('../middleware/validateMiddleware');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { resetPasswordWithOtpSchema } = require('../schemas/userSchema');
const userController = require('../controllers/userController');

router.post(
  '/request-password-otp',
  ensureAuthenticated,
  catchAsync(userController.requestPasswordOtp)
);
router.post(
  '/reset-password-with-otp',
  ensureAuthenticated,
  validate(resetPasswordWithOtpSchema),
  catchAsync(userController.resetPasswordWithOtp)
);

module.exports = router;

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const sendEmail = require('../config/email');
const ExpressError = require('../utils/ExpressError');

module.exports.requestPasswordOtp = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ExpressError('User not found.', 404);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.passwordResetOTP = otp;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendEmail({
    email: user.email,
    subject: 'Your Password Reset OTP',
    message: `Your One-Time Password (OTP) for resetting your password is: ${otp}\nIt is valid for 10 minutes.`,
  });

  res.status(200).json({ message: 'OTP sent to your email.' });
};

module.exports.resetPasswordWithOtp = async (req, res) => {
  const { otp, newPassword } = req.body;

  const user = await User.findOne({
    _id: req.user.id,
    passwordResetOTP: otp,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ExpressError('Invalid OTP or OTP has expired.', 400);
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.passwordResetOTP = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password has been reset successfully.' });
};

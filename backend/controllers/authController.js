const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const sendEmail = require('../config/email');
const ExpressError = require('../utils/ExpressError');

module.exports.register = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const newUser = new User({ email, password });
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
  const user = await newUser.save();

  res.status(201).json({ message: 'User registered successfully!', userId: user.id });
};

module.exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({
        message: 'Login successful!',
        user: { id: user.id, email: user.email },
      });
    });
  })(req, res, next);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: 'Logout successful!' });
  });
};

module.exports.status = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ isLoggedIn: true, user: { id: req.user.id, email: req.user.email } });
  } else {
    res.status(401).json({ isLoggedIn: false, user: null });
  }
};

// Shared helper: generate + store a 6-digit OTP on a user doc, valid 10 min
async function issuePasswordResetOTP(user) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.passwordResetOTP = otp;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save();
  return otp;
}

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Don't reveal whether the email is registered — always return the same message
  const genericResponse = {
    message: 'If this email is registered, a password reset OTP has been sent.',
  };

  if (!user) {
    return res.status(200).json(genericResponse);
  }

  const otp = await issuePasswordResetOTP(user);

  await sendEmail({
    email: user.email,
    subject: 'Your Password Reset OTP',
    message: `You requested a password reset. Your One-Time Password (OTP) is: ${otp}\nIt is valid for 10 minutes.`,
  });

  res.status(200).json(genericResponse);
};

module.exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({
    email,
    passwordResetOTP: otp,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ExpressError('Invalid OTP or OTP has expired. Please request a new one.', 400);
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.passwordResetOTP = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password has been reset successfully. You can now log in.' });
};

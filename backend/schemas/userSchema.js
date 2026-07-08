const Joi = require('joi');

module.exports.resetPasswordWithOtpSchema = Joi.object({
  otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
  newPassword: Joi.string().min(6).required(),
});

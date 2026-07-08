const Joi = require('joi');

module.exports.expenseSchema = Joi.object({
  description: Joi.string().trim().min(1).max(200).required(),
  amount: Joi.number().positive().required(),
  category: Joi.string().trim().min(1).max(50).required(),
  date: Joi.date().optional(),
});

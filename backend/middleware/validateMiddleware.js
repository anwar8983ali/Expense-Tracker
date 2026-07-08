const ExpressError = require('../utils/ExpressError');

// Returns an Express middleware that validates req.body against the given
// Joi schema. Bad input is rejected with a 400 before it ever reaches a
// controller or the database.
module.exports = function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map((el) => el.message).join(', ');
      return next(new ExpressError(message, 400));
    }
    next();
  };
};

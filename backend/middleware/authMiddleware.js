
const ExpressError = require('../utils/ExpressError');
const Expense = require('../models/expense');

// This middleware checks if a user is authenticated
const ensureAuthenticated = (req, res, next) => {
  // req.isAuthenticated() is a method provided by Passport.js
  // It returns true if the user has a valid session.
  if (req.isAuthenticated()) {
    // If they are logged in, proceed to the next function (the actual route handler)
    return next();
  }
  // If they are not logged in, send a 401 Unauthorized error
  res.status(401).json({ message: 'You are not authorized' });
};

// This middleware checks that the expense being updated/deleted actually
// belongs to the logged-in user, not just that *someone* is logged in.
// Without this, any logged-in user could edit or delete any expense by
// guessing/passing another user's expense id in the URL.
// Attaches the found expense to req.expense so the controller doesn't
// need to query the database a second time.
const isExpenseOwner = async (req, res, next) => {
  const { id } = req.params;
  const expense = await Expense.findById(id);
  if (!expense) {
    return next(new ExpressError('Expense not found', 404));
  }
  if (!expense.user.equals(req.user.id)) {
    return next(new ExpressError('You do not have permission to do that', 403));
  }
  req.expense = expense;
  next();
};

module.exports = { ensureAuthenticated, isExpenseOwner };
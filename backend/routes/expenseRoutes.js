const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const validate = require('../middleware/validateMiddleware');
const { ensureAuthenticated, isExpenseOwner } = require('../middleware/authMiddleware');
const { expenseSchema } = require('../schemas/expenseSchema');
const expenseController = require('../controllers/expenseController');

router.get('/', ensureAuthenticated, catchAsync(expenseController.getExpenses));
router.post(
  '/',
  ensureAuthenticated,
  validate(expenseSchema),
  catchAsync(expenseController.createExpense)
);
router.put(
  '/:id',
  ensureAuthenticated,
  catchAsync(isExpenseOwner),
  validate(expenseSchema),
  catchAsync(expenseController.updateExpense)
);
router.delete(
  '/:id',
  ensureAuthenticated,
  catchAsync(isExpenseOwner),
  catchAsync(expenseController.deleteExpense)
);

module.exports = router;

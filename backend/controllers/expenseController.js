const Expense = require('../models/expense');

module.exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
  res.json(expenses);
};

module.exports.createExpense = async (req, res) => {
  const { description, amount, category, date } = req.body;
  const newExpense = new Expense({
    description,
    amount,
    category,
    date,
    user: req.user.id,
  });
  const expense = await newExpense.save();
  res.status(201).json(expense);
};

// req.expense is attached by the isExpenseOwner middleware, so by the
// time we get here we already know this expense exists and belongs
// to the logged-in user — no need to look it up or check ownership again.
module.exports.updateExpense = async (req, res) => {
  const { description, amount, category, date } = req.body;
  req.expense.description = description;
  req.expense.amount = amount;
  req.expense.category = category;
  if (date) req.expense.date = date;
  const updated = await req.expense.save();
  res.status(200).json(updated);
};

module.exports.deleteExpense = async (req, res) => {
  await Expense.findByIdAndDelete(req.expense._id);
  res.status(200).json({ message: 'Expense deleted', id: req.expense._id });
};

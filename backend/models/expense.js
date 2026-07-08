
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  // This is the most important part: linking an expense to a user.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This refers to the 'User' model
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true, // Removes whitespace from the beginning and end
  },

  amount: {
    type: Number,
    required: [true, 'Please add a positive number'],
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Expense', ExpenseSchema);
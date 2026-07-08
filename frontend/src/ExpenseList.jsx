import React, { useState } from 'react';
import './ExpenseList.css';

const CATEGORY_OPTIONS = ['Food', 'Entertainment', 'Utilities', 'Travel', 'Materials', 'Labor', 'Software', 'Other'];

// This component now receives the 'expenses' array, plus update/delete
// handlers, as props from HomePage.
export default function ExpenseList({ expenses, onUpdateExpense, onDeleteExpense }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ description: '', amount: '', category: '', date: '' });
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);

  const startEditing = (expense) => {
    setEditingId(expense._id);
    setDraft({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: new Date(expense.date).toISOString().slice(0, 10),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = (id) => {
    onUpdateExpense(id, {
      description: draft.description,
      amount: parseFloat(draft.amount),
      category: draft.category,
      date: draft.date,
    });
    setEditingId(null);
  };

  const handleDeleteClick = (id) => {
    if (confirmingDeleteId === id) {
      onDeleteExpense(id);
      setConfirmingDeleteId(null);
    } else {
      setConfirmingDeleteId(id);
    }
  };

  return (
    <div className="expense-list-container">
      <h2 className="expense-list-title">Recent Transactions</h2>
      <div className="expense-table-wrapper">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th className="amount-header">Amount</th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((expense) => {
                const isEditing = editingId === expense._id;
                return (
                  <tr key={expense._id}>
                    {isEditing ? (
                      <>
                        <td data-label="Description">
                          <input
                            className="edit-input"
                            value={draft.description}
                            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                          />
                        </td>
                        <td data-label="Category">
                          <select
                            className="edit-input"
                            value={draft.category}
                            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                          >
                            {CATEGORY_OPTIONS.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </td>
                        <td data-label="Date">
                          <input
                            type="date"
                            className="edit-input"
                            value={draft.date}
                            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                          />
                        </td>
                        <td data-label="Amount" className="expense-amount">
                          <input
                            type="number"
                            step="0.01"
                            className="edit-input edit-input-amount"
                            value={draft.amount}
                            onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
                          />
                        </td>
                        <td data-label="Actions" className="actions-cell">
                          <button className="action-btn save-btn" onClick={() => saveEditing(expense._id)}>Save</button>
                          <button className="action-btn cancel-btn" onClick={cancelEditing}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td data-label="Description">{expense.description}</td>
                        <td data-label="Category">{expense.category}</td>
                        <td data-label="Date">{new Date(expense.date).toLocaleDateString()}</td>
                        <td data-label="Amount" className="expense-amount">
                          ${expense.amount.toFixed(2)}
                        </td>
                        <td data-label="Actions" className="actions-cell">
                          <button className="action-btn edit-btn" onClick={() => startEditing(expense)}>Edit</button>
                          <button
                            className={`action-btn delete-btn ${confirmingDeleteId === expense._id ? 'confirming' : ''}`}
                            onClick={() => handleDeleteClick(expense._id)}
                            onBlur={() => setConfirmingDeleteId(null)}
                          >
                            {confirmingDeleteId === expense._id ? 'Confirm?' : 'Delete'}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="no-expenses-message">
                  No expenses recorded yet. Click "Add Expense" to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

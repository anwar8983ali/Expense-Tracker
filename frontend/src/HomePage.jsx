import React, { useState, useEffect } from 'react';
import api from './api/axios';
import Header from './/Header';
import SummaryMetrics from './SummaryMetrics';
import ExpenseChart from './ExpenseChart';
import ExpenseList from './ExpenseList';
import AddExpenseModal from './AddExpenseModal'; // Import the new modal
import './HomePage.css';

export default function HomePage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal

  // Function to fetch expenses from the backend
  const fetchExpenses = async () => {
    try {
      const response = await api.get('/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch expenses when the component first mounts
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Function to handle adding a new expense, passed to the modal
  const handleAddExpense = async (expenseData) => {
    try {
      // Send the new expense data to the backend
      await api.post('/api/expenses', expenseData);
      // Close the modal and refresh the expense list from the server
      setIsModalOpen(false);
      fetchExpenses(); // Re-fetch to get the most up-to-date list
    } catch (error) {
      console.error('Failed to add expense:', error);
      // In a real app, you would set an error state here to show in the modal
    }
  };

  // Updates an existing expense, then refreshes the list from the server
  const handleUpdateExpense = async (id, expenseData) => {
    try {
      await api.put(`/api/expenses/${id}`, expenseData);
      fetchExpenses();
    } catch (error) {
      console.error('Failed to update expense:', error);
    }
  };

  // Deletes an expense. Optimistically removes it from state first so the
  // UI feels instant, then re-fetches to make sure we stay in sync with
  // the server (and rolls back by re-fetching if the delete failed).
  const handleDeleteExpense = async (id) => {
    const previous = expenses;
    setExpenses((prev) => prev.filter((e) => e._id !== id));
    try {
      await api.delete(`/api/expenses/${id}`);
    } catch (error) {
      console.error('Failed to delete expense:', error);
      setExpenses(previous); // roll back on failure
    }
  };

  // Show a loading message while fetching initial data
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading your dashboard...</div>;
  }

  return (
    <div className="home-page-container">
      <Header />
      
      <main className="main-content">
        <div className="dashboard-header">
           <div className="dashboard-title-group">
            <h1>Dashboard</h1>
            <p>Welcome back.</p>
          </div>
          {/* This button now opens the modal */}
          <button onClick={() => setIsModalOpen(true)} className="add-expense-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>Add Expense</span>
          </button>
        </div>

        {/* Pass the real expenses data to child components */}
        <SummaryMetrics expenses={expenses} />

        <div className="data-display-section">
          <div className="chart-area">
            <ExpenseChart expenses={expenses} />
          </div>
          <div className="list-area">
            <ExpenseList
              expenses={expenses}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>
        </div>
      </main>

      {/* Render the modal component and pass the necessary props */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddExpense={handleAddExpense}
      />
    </div>
  );
}
import React from 'react';
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  ComposedChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './ExpenseChart.css'; // Corrected filename

const COLORS = ['#4f46e5', '#f97316', '#10b981', '#ef4444', '#3b82f6'];

// This component now receives the 'expenses' array as a prop from HomePage
export default function ExpenseCharts({ expenses }) {
  
  // --- Process the real data for Bar/Pie/Radar Chart (Group by Category) ---
  const categoryData = expenses.reduce((acc, expense) => {
    const category = acc.find(item => item.name === expense.category);
    if (category) {
      category.total += expense.amount;
    } else {
      acc.push({ name: expense.category, total: expense.amount });
    }
    return acc;
  }, []);

  // --- Process the real data for Composed Chart (Group by Date) ---
  const dateData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toLocaleDateString();
    const day = acc.find(item => item.date === date);
    if (day) {
      day.total += expense.amount;
    } else {
      acc.push({ date: date, total: expense.amount });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Process data to include a 3-day moving average
  const dataWithMovingAverage = dateData.map((entry, index, arr) => {
    const sumSlice = arr.slice(Math.max(0, index - 2), index + 1);
    const movingAverage = sumSlice.reduce((acc, val) => acc + val.total, 0) / sumSlice.length;
    return { ...entry, movingAverage: parseFloat(movingAverage.toFixed(2)) };
  });

  // If there's no data, show a friendly message
  if (expenses.length === 0) {
    return (
      <div className="charts-container-empty">
        <h3>No Data for Charts</h3>
        <p>Add some expenses to see your visualizations.</p>
      </div>
    );
  }

  return (
    <div className="charts-container">
      <div className="chart-grid">

        {/* --- Bar Chart Section --- */}
        <div className="chart-wrapper">
          <h3 className="chart-title">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Bar dataKey="total" fill="#4f46e5" name="Total Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* --- Pie Chart Section --- */}
        <div className="chart-wrapper">
          <h3 className="chart-title">Spending Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={110} fill="#8884d8" dataKey="total" nameKey="name">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* --- Radar Chart Section --- */}
        <div className="chart-wrapper">
            <h3 className="chart-title">Spending Shape</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']}/>
                    <Radar name="Expenses" dataKey="total" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                </RadarChart>
            </ResponsiveContainer>
        </div>

        {/* --- Composed Chart Section --- */}
        <div className="chart-wrapper">
          <h3 className="chart-title">Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={dataWithMovingAverage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="total" fill="#a78bfa" name="Daily Total" />
              <Line type="monotone" dataKey="movingAverage" stroke="#f97316" strokeWidth={2} name="3-Day Average" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { useSprings, animated } from '@react-spring/web';
import SummaryCard from './SummaryCard';
import { useAuth } from './context/AuthContext';

// This component now receives the 'expenses' array as a prop from HomePage
export default function SummaryMetrics({ expenses }) {
  const { user } = useAuth(); // Get user info from context

  // --- Calculate real metrics from the live data ---
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalTransactions = expenses.length;

  // Placeholder for more complex "This Month" logic
  const thisMonthExpenses = totalExpenses; 

  const metricsData = [
      { title: "Total Expenses", value: `₹${totalExpenses.toFixed(2)}` },
      { title: "This Month", value: `₹${thisMonthExpenses.toFixed(2)}` },
      { title: "Total Transactions", value: totalTransactions },
      { title: "Your User ID", value: user?.id?.slice(-12) || 'N/A' } // Show last 12 chars of the real user ID
  ];

  // The react-spring animation logic remains the same
  const springs = useSprings(
    metricsData.length,
    metricsData.map((item, index) => ({
      from: { opacity: 0, transform: 'translateY(30px)' },
      to: { opacity: 1, transform: 'translateY(0px)' },
      delay: index * 100,
      config: { mass: 1, tension: 280, friction: 25 }
    }))
  );

  return (
    <div className="summary-metrics-grid">
      {springs.map((style, index) => (
        <animated.div style={style} key={metricsData[index].title}>
          <SummaryCard
            title={metricsData[index].title}
            value={metricsData[index].value}
          />
        </animated.div>
      ))}
    </div>
  );
}


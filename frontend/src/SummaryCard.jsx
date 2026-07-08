

import React from 'react';
import "./SummaryCard";

// A reusable card component that takes a title and a value as props.
export default function SummaryCard({ title, value }) {
  return (
    <div className="summary-card">
      <h3 className="card-title">{title}</h3>
      <p className="card-value">{value}</p>
    </div>
  );
}

import React from 'react';
import './MetricCard.css'; // Assuming you have a CSS file for styles

const MetricCard = ({ title, value, unit }) => {
  return (
    <div className="metric-card">
      <div className="metric-title">{title}</div>
      <div className="metric-value">{value.toLocaleString()} {unit}</div>
    </div>
  );
};

export default MetricCard;

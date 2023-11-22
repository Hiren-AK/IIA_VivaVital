import React from 'react';
import UserInputForm from '../components01/UserInputForm';

function Home() {
  return (
    <div>
      <h1>VivaVital Health Metrics Dashboard</h1>
      {metrics ? (
        <div>
          <p>Steps Today: {formatNumber(metrics.stepsToday)}</p>
          <p>Steps This Week: {formatNumber(metrics.stepsWeek)}</p>
          <p>Steps Total: {formatNumber(metrics.stepsTotal)}</p>
          <p>Distance Today (meters): {formatNumber(metrics.distanceToday)}</p>
          <p>Distance This Week (meters): {formatNumber(metrics.distanceWeek)}</p>
          <p>Distance Total (meters): {formatNumber(metrics.distanceTotal)}</p>
          <p>Calories Burned Today: {formatNumber(metrics.caloriesToday)}</p>
          <p>Calories Burned This Week: {formatNumber(metrics.caloriesWeek)}</p>
          <p>Calories Burned Total: {formatNumber(metrics.caloriesTotal)}</p>
          <p>Sleep Today (hours): {formatNumber(metrics.sleepToday)}</p>
          <p>Sleep This Week (hours): {formatNumber(metrics.sleepWeek)}</p>
          <p>Sleep Total (hours): {formatNumber(metrics.sleepTotal)}</p>
          <p>Daily Calories Required: {formatNumber(cal)}</p>
        </div>
      ) : (
        <div>Waiting for data...</div>
      )}
    </div>
  );
};

export default Home;

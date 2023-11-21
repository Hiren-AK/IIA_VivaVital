import React, { useState, useEffect } from 'react';
import './Home.css'


const Home = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket('ws://192.168.46.232:8001');

    ws.onopen = () => {
      console.log('WebSocket connected to frontend');
    };

    ws.onmessage = (event) => {
      try {
        // Attempt to parse the event data as JSON
        const data = JSON.parse(event.data);
        console.log('Data received:', data);
        setMetrics(data);
      } catch (error) {
        console.error('Error parsing message:', error);
        // Handle any non-JSON messages or other actions here
      }
    };
    

    ws.onclose = () => {
      console.log('WebSocket disconnected from frontend');
    };

    ws.onerror = (error) => {
      console.error('frontend WebSocket error:', error);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  // Format number to have commas for thousands
  const formatNumber = (num) => {
    return num ? num.toLocaleString() : '0';
  };

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
        </div>
      ) : (
        <div>Waiting for data...</div>
      )}
    </div>
  );
};

export default Home;

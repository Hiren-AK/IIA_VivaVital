import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import calculateBmi from '../APIcalls/Bmi';
import calculateMacros from '../APIcalls/Macros';
import calculateIdealWeight from '../APIcalls/IdealWeight';
import './Home.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom';
import MetricCard from './MetricCard';







const Home = () => {
  
  const { user } = useContext(UserContext);
  const [metrics, setMetrics] = useState(null);
  const navigate = useNavigate();

  const [bmi, setBmi] = useState(null);
  const [idealWeight, setIdealWeight] = useState(null);
  const [macros, setMacros] = useState(null);

  const handleRecipies = () => {
    localStorage.setItem('metrics', JSON.stringify(metrics));
    navigate('/recipes'); // Make sure the route is correct as per your routing setup
  };

  const handleEditDemographics = () => {
    navigate('/editdemographics'); // Make sure the route is correct as per your routing setup
  }

  useEffect(() => { 
    async function fetchMacros() {
      try {
        const result = await calculateMacros(user.user);
        setMacros(result);
      } catch (error) {
        console.error('Error fetching BMI:', error);
        // Handle the error appropriately
      }
    }
    fetchMacros();

    async function fetchBmi() {
      try {
        const result = await calculateBmi(user.user);
        setBmi(result);
      } catch (error) {
        console.error('Error fetching BMI:', error);
        // Handle the error appropriately
      }
    }
    fetchBmi();

    async function fetchIdealWeight() {
      try {
        const result = await calculateIdealWeight(user.user);
        setIdealWeight(result);
      } catch (error) {
        console.error('Error fetching BMI:', error);
        // Handle the error appropriately
      }
    }
    fetchIdealWeight();
  }, [user.user]);
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
        localStorage.setItem('metrics', JSON.stringify(data));
        console.log('locally saved metrics:', localStorage.getItem('metrics'));
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
      localStorage.removeItem('metrics');
    };
  }, []);

  // Format number to have commas for thousands
  const formatNumber = (num) => {
    return num ? num.toLocaleString() : '0';
  };
  const formatValue = (value) => {
    return value ? Math.round(value).toLocaleString() : '0';
  };
  // const handleRecipeSearch = () => {
  //   // Navigate to the "/recipes" route when the button is clicked
  //   navigate('/recipes');
  // };

  if(macros && metrics){
    return (
      <div className="home-container">
        <h1>VivaVital Health Metrics Dashboard</h1>
        <div className="metrics-section">
          <div className="metrics-grid">
            <MetricCard title="Steps" value={formatValue(metrics?.stepsToday)} unit="" />
            <MetricCard title="Distance" value={formatValue(metrics?.distanceToday)} unit="km" />
            <MetricCard title="Calories Burned" value={formatValue(metrics?.caloriesToday)} unit="cal" />
            <MetricCard title="Sleep" value={formatValue(metrics?.sleepToday)} unit="hours" />
            <MetricCard title="BMI" value={formatValue(bmi)} unit="" />
            <MetricCard title="Ideal Weight" value={formatValue(idealWeight)} unit="kg" />
            <MetricCard title="Daily Calorie Requirement" value={formatValue(macros.calorie)} unit="cal" />
          </div>
          <div className="diet-section">
            <div className="diet-header">Balanced Diet</div>
            <div className="metrics-grid">
              <MetricCard title="Protein" value={formatValue(macros?.balanced_protein)} unit="g" />
              <MetricCard title="Fat" value={formatValue(macros?.balanced_fat)} unit="g" />
              <MetricCard title="Carbs" value={formatValue(macros?.balanced_carbs)} unit="g" />
            </div>
          </div>
          <div className="diet-section">
            <div className="diet-header">Low Carbs Diet</div>
            <div className="metrics-grid">
              <MetricCard title="Protein" value={formatValue(macros.lowcarbs_protein)} unit="g" />
              <MetricCard title="Fat" value={formatValue(macros.lowcarbs_fat)} unit="g" />
              <MetricCard title="Carbs" value={formatValue(macros.lowcarbs_carbs)} unit="g" />
            </div>
          </div>
          <div className="diet-section">
            <div className="diet-header">Low Fat Diet</div>
            <div className="metrics-grid">
              <MetricCard title="Protein" value={formatValue(macros.lowfat_protein)} unit="g" />
              <MetricCard title="Fat" value={formatValue(macros.lowfat_fat)} unit="g" />
              <MetricCard title="Carbs" value={formatValue(macros.lowfat_carbs)} unit="g" />
            </div>
          </div>
        </div>
        <button type="button" onClick={handleRecipies}>Search Recipies</button>
        <button type="button" onClick={handleEditDemographics}>Edit Demographics</button>
      
    </div>
  );
}


};

export default Home;
import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import calculateBmi from '../APIcalls/Bmi';
import calculateMacros from '../APIcalls/Macros';
import calculateIdealWeight from '../APIcalls/IdealWeight';
import './Home.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom';



const Home = () => {
  const { user } = useContext(UserContext);
  const [metrics, setMetrics] = useState(null);

  const [bmi, setBmi] = useState(null);
  const [idealWeight, setIdealWeight] = useState(null);
  const [macros, setMacros] = useState(null);

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
  // const handleRecipeSearch = () => {
  //   // Navigate to the "/recipes" route when the button is clicked
  //   navigate('/recipes');
  // };

  if(macros){
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
          <p>BMI: {bmi}</p>
          <p>Ideal Weight: {idealWeight}</p>
          <div>
            <h2>Calories: {macros.calorie}</h2>
            <h3>Balanced Diet</h3>
            <p>Protein: {macros.balanced_protein}</p>
            <p>Fat: {macros.balanced_fat}</p>
            <p>Carbs: {macros.balanced_carbs}</p>
            <h3>High Protein Diet</h3>
            <p>Protein: {macros.highprotein_protein}</p>
            <p>Fat: {macros.highprotein_fat}</p>
            <p>Carbs: {macros.highprotein_carbs}</p>
            <h3>Low Carbs Diet</h3>
            <p>Protein: {macros.lowcarbs_protein}</p>
            <p>Fat: {macros.lowcarbs_fat}</p>
            <p>Carbs: {macros.lowcarbs_carbs}</p>
            <h3>Low Fat Diet</h3>
            <p>Protein: {macros.lowfat_protein}</p>
            <p>Fat: {macros.lowfat_fat}</p>
            <p>Carbs: {macros.lowfat_carbs}</p>
          </div>
        </div>
      ) : (
        <div>Waiting for data...</div>
      )}
      <Link to="/recipes">
        <button>Search Recipes</button>
      </Link>
      <Link to="/editdemographics">
        <button>Edit Demographic</button>
      </Link>
    </div>
  );
}
};

export default Home;
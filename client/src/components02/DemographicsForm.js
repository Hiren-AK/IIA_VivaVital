import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';
import './demographics.css'

function DemographicsForm() {
    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    const [demographics, setDemographics] = useState({
      birthdate: '',
      gender: '',
      weight: '',
      height: '',
      userID: user.user,
      activityLevel: '',
      goal: ''
    });
    console.log('Sending demographics:', demographics);
    const [errors, setErrors] = useState({});
  
    const handleChange = (e) => {
      setDemographics({ ...demographics, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:8001/demographics', demographics);
        console.log('Response:', response.data);
        navigate('/Home');
      } catch (error) {
        if (error.response && error.response.data) {
          // Update the state with the backend error
          setErrors({ ...errors, backend: error.response.data });
        } else {
          // Handle other errors like network issues
          setErrors({ ...errors, network: 'Network error' });
        }
      }
    };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1 className="login-title">VIVAVITAL</h1>
        <p className="welcome-back">Tell us about yourself!</p>
        <form onSubmit={handleSubmit} className='login-form'>
          <div className="input-container">
          <label>Birthdate</label> <br/>
          <input type="date" name="birthdate" value={demographics.birthdate} onChange={handleChange} required />
      
          </div>

          <div className="input-container">
          <label>Gender</label> <br/>
            <select name="gender" value={demographics.gender} onChange={handleChange} required>
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
      
          </div>

          <div className="input-container">
          <label>Weight (kg):</label> <br/>
            <input type="number" name="weight" value={demographics.weight} onChange={handleChange} required />
            
          </div>

          <div className="input-container">
          <label>Height (cm):</label> <br/>
            <input type="number" name="height" value={demographics.height} onChange={handleChange} required />
            
          </div>
        
          <div className="input-container">
          <label>Activity Level</label> <br/>
            <select name="activityLevel" value={demographics.activityLevel} onChange={handleChange} required>
              <option value="">Select...</option>
              <option value="level_1">Sedentary: little or no exercise</option>
              <option value="level_2">Exercise 1-3 times/week</option>
              <option value="level_3">Exercise 4-5 times/week</option>
              <option value="level_4">Daily exercise or intense exercise 3-4 times/week</option>
              <option value="level_5">Intense exercise 6-7 times/week</option>
              <option value="level_6">Very intense exercise daily, or physical job</option>
            </select>
            
          </div>

          <div className="input-container">
          <label>Goal</label><br/>
            <select name="goal" value={demographics.goal} onChange={handleChange} required>
              <option value="">Select...</option>
              <option value="maintain">Maintain weight</option>
              <option value="mildlose">Mild weight loss</option>
              <option value="weightlose">Weight loss</option>
              <option value="extremelose">Extreme weight loss</option>
              <option value="mildgain">Mild weight gain</option>
              <option value="weightgain">Weight gain</option>
              <option value="extremegain">Extreme weight gain</option>
            </select>
            
          </div>

      <button type="submit">Submit</button>

    </form>


  </div>
  
</div>






    
  );
}

export default DemographicsForm;

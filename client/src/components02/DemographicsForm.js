import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';

function DemographicsForm() {
    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    const [demographics, setDemographics] = useState({
      birthdate: '',
      gender: '',
      weight: '',
      height: '',
      userID: user
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
        navigate('/Home')
        console.log('Response:', response.data);
        // Redirect or update UI here
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
    <form onSubmit={handleSubmit}>
      <label>
        Birthdate:
        <input type="date" name="birthdate" value={demographics.birthdate} onChange={handleChange} required />
      </label>
      <label>
        Gender:
        <select name="gender" value={demographics.gender} onChange={handleChange} required>
          <option value="">Select...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </label>
      <label>
        Weight (kg):
        <input type="number" name="weight" value={demographics.weight} onChange={handleChange} required />
      </label>
      <label>
        Height (cm):
        <input type="number" name="height" value={demographics.height} onChange={handleChange} required />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default DemographicsForm;

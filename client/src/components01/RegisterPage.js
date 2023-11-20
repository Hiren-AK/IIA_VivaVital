import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../utils/temp.css';


function RegisterPage() {
  // State to store input values
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    errors: {
      username: '',
      email: '',
      password: ''
    }
  });

  const navigate = useNavigate();

  // functions to validate email and password strength:
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
  const validatePasswordStrength = (password) => {
    // Example: Medium strength password check (you can adjust the criteria)
    const isMedium = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
    return isMedium;
  };
  

  // Update state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    let errors = { ...userData.errors };
  
    switch (name) {
      case 'email':
        errors.email = validateEmail(value) ? '' : 'Email is not valid';
        break;
      case 'password':
        errors.password = validatePasswordStrength(value) ? '' : 'Password is not strong enough';
        break;
      default:
        break;
    }
  
    setUserData({ ...userData, [name]: value, errors });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let errors = { ...userData.errors };
    if (!validateEmail(userData.email) || !validatePasswordStrength(userData.password)) {
      // Update errors state if any client-side validations fail
      setUserData({ ...userData, errors });
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8001/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password
      });
      navigate('/demographics');
      // Handle success, e.g., redirect to login or show success message
    } catch (error) {
      if (error.response && error.response.data) {
        // Update the state with the backend error
        setUserData(prevState => ({
          ...prevState,
          errors: { ...prevState.errors, backend: error.response.data }
        }));
      }
    }
  };

  return (
    <div>
      <h2>Register for VivaVital</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={userData.username}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
          required
        />
        {userData.errors.email && <div className="error">{userData.errors.email}</div>}
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleChange}
          required
        />
        {userData.errors.password && <div className="error">{userData.errors.password}</div>}
        <br />
        <button type="submit">Register</button>
      </form>
      {userData.errors.backend && <div className="error">{userData.errors.backend}</div>}{/* Display error here */}
    </div>
  );
}

export default RegisterPage;

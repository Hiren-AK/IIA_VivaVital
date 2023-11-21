import React, { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'


function LoginPage() {

  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    error: ''
  });
  

  // Update state on input change
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    try {
      const response = await axios.post('http://localhost:8001/login', {
        email: loginData.email,
        password: loginData.password
      });
      const userID = response.data.userId;

      // Access and use the data from the server response
      console.log('User ID in Login Page:', userID);

      setUser({ user: userID });
      navigate('/Home');
    } catch (error) {
      if (error.response) {
        // Set the error message from the backend
        setLoginData({ ...loginData, error: error.response.data });
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1 className="login-title">VIVAVITAL</h1>
        <p className="welcome-back">Welcome Back!</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="sign-in-button" color='#B2F042'>Sign In</button>
          <p className="register-prompt">
            New User? <a href="/register" color='#4164D0'>Register</a>
          </p>
        </form>
        {loginData.error && <div className="error">{loginData.error}</div>}
      </div>
      
    </div>
  );
}

export default LoginPage;

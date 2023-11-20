import React, { useState } from 'react';
import axios from 'axios';
import '../utils/temp.css'

function LoginPage() {
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
      // Handle successful login here, like redirecting to another page
    } catch (error) {
      if (error.response) {
        // Set the error message from the backend
        setLoginData({ ...loginData, error: error.response.data });
      }
    }
  };

  return (
    <div>
      <h2>Login to VivaVital</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleChange}
          required
        /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleChange}
          required
        /><br />
        <button type="submit">Login</button>
      </form>
      {loginData.error && <div className="error">{loginData.error}</div>} {/* Display error here */}
    </div>
  );
}

export default LoginPage;

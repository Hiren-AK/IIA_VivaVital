import React from 'react';
import './LandingPage.css'; // The name of your CSS file
import logo from './logo-white.png'

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-header">
        <img src={logo} alt="VivaVital Logo" className="landing-logo" />
        <h1 className="landing-title">VIVAVITAL</h1>
      </div>

      <div className="landing-actions">
        <button className='register-button' onClick={() => window.location.href='/register'}>Register</button>
        <button className='login-button' onClick={() => window.location.href='/login'}>Login</button>
      </div>

      <footer className="landing-footer">
        <p>&copy; 2023 VivaVital</p>
      </footer>
    </div>
  );
}


export default LandingPage;
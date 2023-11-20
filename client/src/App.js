import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LandingPage, LoginPage, RegisterPage, DemographicsForm }from './components01';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/demographics" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;

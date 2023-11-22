import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './UserContext';
import LandingPage from './components01/LandingPage';
import LoginPage from './components01/LoginPage';
import RegisterPage from './components01/RegisterPage';
import DemographicsForm from './components02/DemographicsForm';
import EditDemographics from './components02/EditDemographics';
import Home from './components02/Home';
import RecipeSearch from './components02/RecipeSearch';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/demographics" element={<DemographicsForm />} />
          <Route path="/home" element={<Home/>}/>
          <Route path="/editdemographics" element={<EditDemographics/>}/>
          <Route path="/recipes" element={<RecipeSearch/>}/>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import RegisterPage from './components/RegisterPage.jsx';
import ProfilePage from './components/ProfilePage.jsx';

function App() {
  // Basic auth check for demonstration
  const isAuthenticated = () => !!localStorage.getItem('token');

  return (
    <Routes>
      {/* Public Landing/Homepage */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Route */}
      <Route
        path="/profile"
        element={
          isAuthenticated() ? <ProfilePage /> : <Navigate to="/login" />
        }
      />

      {/* Fallback for any unknown route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

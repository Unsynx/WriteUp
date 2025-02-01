// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx"; // Updated path
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import Layout from "./components/Layout.jsx"; // if you have a layout

function App() {
  // Your existing state and logic here...
  
  // Example authentication check:
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
            <LandingPage />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
            {isAuthenticated ? <Navigate to="/profile" /> : <LoginPage setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />}
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
            {isAuthenticated ? <Navigate to="/profile" /> : <RegisterPage />}
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
            {isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
          </Layout>
        }
      />
      <Route
        path="*"
        element={
          <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
            <h1>404 - Page Not Found</h1>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;

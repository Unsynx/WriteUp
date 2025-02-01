// src/App.jsx
import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';

const LandingPage = React.lazy(() => import('./components/LandingPage.jsx'));
const LoginPage = React.lazy(() => import('./components/LoginPage.jsx'));
const RegisterPage = React.lazy(() => import('./components/RegisterPage.jsx'));
const ProfilePage = React.lazy(() => import('./components/ProfilePage.jsx'));
const PlacementPage = React.lazy(() => import('./components/PlacementPage.jsx'));
const Leaderboard = React.lazy(() => import('./components/Leaderboard.jsx'));
const Badges = React.lazy(() => import('./components/Badges.jsx'));
const Tutorial = React.lazy(() => import('./components/Tutorial.jsx'));
const SearchChallenges = React.lazy(() => import('./components/SearchChallenges.jsx'));

function App() {
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
    <Suspense fallback={<div>Loading...</div>}>
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
          path="/placement"
          element={
            <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
              <PlacementPage />
            </Layout>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
              <Leaderboard />
            </Layout>
          }
        />
        <Route
          path="/badges"
          element={
            <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
              <Badges />
            </Layout>
          }
        />
        <Route
          path="/tutorial"
          element={
            <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
              <Tutorial />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
              <SearchChallenges />
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
    </Suspense>
  );
}

export default App;

// src/App.jsx
import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Navbar.jsx';

const LandingPage = React.lazy(() => import('./pages/LandingPage.jsx'));
const LoginPage = React.lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage.jsx'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage.jsx'));
const PlacementPage = React.lazy(() => import('./pages/PlacementPage.jsx'));
const SearchPage = React.lazy(() => import('./pages/SearchPage.jsx'));
const WriteUpPage = React.lazy(() => import('./pages/WriteUpPage.jsx'));


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
        <Route path="/" element={
          <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
            <LandingPage />
          </Layout>
        } />
        <Route path="/login" element={
          <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
            {isAuthenticated ? <Navigate to="/profile" /> : <LoginPage setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />}
          </Layout>
        } />
        <Route path="/register" element={
          <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
            {isAuthenticated ? <Navigate to="/profile" /> : <RegisterPage />}
          </Layout>
        } />
        <Route path="/profile" element={
          <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
            {isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
          </Layout>
        } />
        <Route path="/placement" element={
          <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
            <PlacementPage />
          </Layout>
        } />
        <Route path="/search" element={
          <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
            <SearchPage />
          </Layout>
        } />
                <Route path="/write" element={
          <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
            <WriteUpPage />
          </Layout>
        } />
        <Route path="*" element={
          <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username}>
            <h1>404 - Page Not Found</h1>
          </Layout>
        } />
      </Routes>
    </Suspense>
  );
}

export default App;
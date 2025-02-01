// src/components/Layout.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // For global toasts
import 'react-toastify/dist/ReactToastify.css';   // Toastify CSS
import './Navbar.css';

const Navbar = ({ children, isAuthenticated, handleLogout, username }) => {
  return (
    <div className="layout-container">
      <header className="layout-header">
        <nav className="navbar">
          <NavLink to="/" className="nav-brand">
            WriteUp
          </NavLink>
          <div className="nav-links">
            {/* NavLink 'activeClassName' prop doesn't work in v6. Instead use 'className' function */}
            <NavLink 
              to="/" 
              className={({ isActive }) => (isActive ? 'active-link' : undefined)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/search"
              className={({ isActive }) => (isActive ? 'active-link' : undefined)}
            >
              Challenges
            </NavLink>
            <NavLink 
              to="/placement"
              className={({ isActive }) => (isActive ? 'active-link' : undefined)}
            >
              Placement Test
            </NavLink>
            {isAuthenticated ? (
              <>
                <span className="welcome">Welcome, {username}!</span>
                <NavLink 
                  to="/profile"
                  className={({ isActive }) => (isActive ? 'active-link' : undefined)}
                >
                  Profile
                </NavLink>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login"
                  className={({ isActive }) => (isActive ? 'active-link' : undefined)}
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register"
                  className={({ isActive }) => (isActive ? 'active-link' : undefined)}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="layout-content">
        {/* Global Toast Container */}
        <ToastContainer position="top-center" autoClose={3000} />
        {children}
      </main>

      <footer className="layout-footer">
        <p>© {new Date().getFullYear()} WriteQuest. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Navbar ;

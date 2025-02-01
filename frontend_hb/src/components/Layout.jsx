// src/components/Layout.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Layout.css'; // Basic CSS (optional if using a library)

const Layout = ({ children, isAuthenticated, handleLogout, username }) => {
  return (
    <div className="layout-container">
      <header className="layout-header">
        <nav className="navbar">
          <NavLink to="/" className="nav-brand">
            WriteQuest
          </NavLink>
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <span className="welcome">Welcome, {username}!</span>
                <NavLink to="/profile">Profile</NavLink>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="layout-content">
        {children}
      </main>

      <footer className="layout-footer">
        <p>© {new Date().getFullYear()} WriteQuest. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;

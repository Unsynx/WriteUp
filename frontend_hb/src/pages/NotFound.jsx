// src/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1>404 - Oops!</h1>
      <p>The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="go-home-link">Go Home</Link>
    </div>
  );
};

export default NotFound;

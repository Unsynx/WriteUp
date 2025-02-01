// src/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1>Welcome to WriteQuest</h1>
      <p>
        Engage with daily writing quests, AI-driven feedback, and real
        competitions that reward your progress!
      </p>
      <div className="landing-btns">
        <Link to="/register" className="cta-btn">Get Started</Link>
        <Link to="/login" className="secondary-btn">Log In</Link>
        <NavLink to="/placement">Placement Test</NavLink>
      </div>
    </div>
  );
};

export default LandingPage;

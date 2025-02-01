// src/components/LandingPage.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1>Welcome to WriteQuest</h1>
      <p>
        Engage with daily writing quests, AI-driven feedback, and exciting competitions that reward your progress!
      </p>
      <div className="landing-btns">
        <NavLink to="/register" className="cta-btn">Get Started</NavLink>
        <NavLink to="/login" className="secondary-btn">Log In</NavLink>
      </div>
    </div>
  );
};

export default LandingPage;

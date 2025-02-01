// src/components/LandingPage.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <>
      <div className="landing-container">
        <h1>Welcome to WriteQuest</h1>
        <p>
          Engage with daily writing quests, AI-driven feedback, and exciting competitions
          that reward your progress!
        </p>
        <div className="landing-btns">
          <NavLink to="/register" className="cta-btn">Get Started</NavLink>
          <NavLink to="/login" className="secondary-btn">Log In</NavLink>
        </div>
      </div>

      <section className="features-section">
        <div className="feature-card">
          <h3>AI-Driven Feedback</h3>
          <p>Receive real-time suggestions on grammar, style, and structure to continuously refine your writing.</p>
        </div>
        <div className="feature-card">
          <h3>Daily Quests</h3>
          <p>Stay motivated with bite-sized challenges that earn you points and valuable rewards.</p>
        </div>
        <div className="feature-card">
          <h3>Community & Collaboration</h3>
          <p>Connect with fellow writers, share insights, and critique each other’s work in a supportive environment.</p>
        </div>
      </section>
    </>
  );
};

export default LandingPage;

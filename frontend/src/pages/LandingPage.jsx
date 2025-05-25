// src/components/LandingPage.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <>
      <div className="landing-container">
        <div className='hero_center'>
          <img className='logo m-auto mb-10' height="200px" src="src/assets/Logo.svg"/>
          <p className='max-w-md m-auto'>
            Write essays like you are solving problems, get AI-driven feedback, and join exciting competitions
            that reward your progress!
          </p>
          <div className="landing-btns">
            <NavLink to="/register" className="cta-btn">Get Started</NavLink>
            <NavLink to="/login" className="secondary-btn">Log In</NavLink>
          </div>
        </div>

      </div>

      <section className="features-section">
        <div className="feature-card">
          <h3>AI-Driven Feedback</h3>
          <p>Receive direct feedback on grammar, style, and structure to continuously refine your writing.</p>
        </div>
        <div className="feature-card">
          <h3>Level Up Your Writing</h3>
          <p>Stay motivated with bite-sized challenges that earn you skill points and rewards.</p>
        </div>
        <div className="feature-card">
          <h3>Community</h3>
          <p>See how you place in the global leaderbaords! </p>
        </div>
      </section>
    </>
  );
};

export default LandingPage;

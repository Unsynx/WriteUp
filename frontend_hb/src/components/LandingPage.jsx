// src/components/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to WriteQuest</h1>
      <p style={styles.subtitle}>
        The AI-powered, gamified platform that helps you master the art of
        writing—no matter your skill level.
      </p>

      <ul style={styles.list}>
        <li><strong>Personalized AI Feedback:</strong> Get real-time grammar checks and style tips to improve every sentence.</li>
        <li><strong>Adaptive Skill Levels:</strong> Start as a “Rookie” and climb the ladder to become a “Narrative Master.”</li>
        <li><strong>Daily Quests & Streaks:</strong> Stay motivated with bite-sized writing challenges and earn rewards.</li>
        <li><strong>Win Real Prizes:</strong> Participate in competitions sponsored by our partners and win opportunities and more.</li>
      </ul>

      <div style={styles.ctaContainer}>
        <Link to="/register" style={styles.ctaButton}>Get Started</Link>
        <Link to="/login" style={styles.secondaryButton}>Log In</Link>
      </div>
    </div>
  );
};

// Inline styles just for demonstration; you can replace with CSS
const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '1.5rem',
    color: '#555',
  },
  list: {
    textAlign: 'left',
    margin: '0 auto 2rem',
    padding: '0 1.5rem',
  },
  ctaContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  ctaButton: {
    backgroundColor: '#6200EE',
    color: '#fff',
    padding: '0.75rem 1.25rem',
    textDecoration: 'none',
    borderRadius: '4px',
  },
  secondaryButton: {
    backgroundColor: '#03DAC5',
    color: '#000',
    padding: '0.75rem 1.25rem',
    textDecoration: 'none',
    borderRadius: '4px',
  }
};

export default LandingPage;

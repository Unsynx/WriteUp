// src/components/Badges.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBadges = async () => {
      setLoading(true);
      try {
        // Replace with your backend endpoint for badges data
        const response = await axios.get('http://localhost:5000/api/badges');
        setBadges(response.data);
      } catch (err) {
        setError('Error fetching badges.');
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Your Badges</h2>
      {loading && <p>Loading badges...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {badges.map((badge) => (
          <li key={badge._id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
            <h3>{badge.name}</h3>
            <p>{badge.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Badges;

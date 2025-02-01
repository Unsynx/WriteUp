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
    <div style={{ width: '100%', padding: '2rem', boxSizing: 'border-box' }}>
      <h2>Your Badges</h2>
      {loading && <p>Loading badges...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {badges.map((badge) => (
          <div
            key={badge._id}
            style={{
              flex: '0 0 200px',
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            {/* If iconUrl is provided by your backend */}
            {badge.iconUrl && (
              <img
                src={badge.iconUrl}
                alt={badge.name}
                style={{ width: '80px', height: '80px', objectFit: 'contain' }}
              />
            )}
            <h3>{badge.name}</h3>
            <p>{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges;

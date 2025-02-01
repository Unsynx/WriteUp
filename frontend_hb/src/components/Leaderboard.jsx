// src/components/Leaderboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        // Replace with your backend endpoint for leaderboard data
        const response = await axios.get('http://localhost:5000/api/leaderboard');
        setLeaders(response.data);
      } catch (err) {
        setError('Error fetching leaderboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Leaderboard</h2>
      {loading && <p>Loading leaderboard...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ol>
        {leaders.map((leader) => (
          <li key={leader._id}>
            {leader.username} - {leader.score} points
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;

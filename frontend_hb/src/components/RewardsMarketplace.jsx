// src/components/RewardsMarketplace.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RewardsMarketplace = () => {
  const [rewards, setRewards] = useState([
    { id: '1', name: 'Book Voucher', description: 'Get a $20 voucher for books', cost: 100 },
    { id: '2', name: 'Writing Software License', description: 'Free license for advanced writing tools', cost: 250 },
    { id: '3', name: 'Premium Membership', description: 'Access exclusive challenges and analytics', cost: 500 },
  ]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Example:
    // axios.get('http://localhost:5000/api/rewards')
    //   .then(response => setRewards(response.data))
    //   .catch(err => setError('Error fetching rewards.'));
  }, []);

  const handleRedeem = (reward) => {
    // For demo, simply alert the reward name.
    // In a real system, call an endpoint to deduct points and update the user's wallet.
    toast.success(`You redeemed: ${reward.name}`);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Rewards Marketplace</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {rewards.map((reward) => (
          <li
            key={reward.id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1rem',
            }}
          >
            <h3>{reward.name}</h3>
            <p>{reward.description}</p>
            <p><strong>Cost:</strong> {reward.cost} points</p>
            <button onClick={() => handleRedeem(reward)} style={{ padding: '0.5rem 1rem' }}>
              Redeem
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RewardsMarketplace;

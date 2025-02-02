// src/components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (err) {
        setError('Error fetching profile.');
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="cover-image">
          {/* Replace the URL below with the desired background image */}
        </div>
        <div className="profile-picture-container">
          <img
            src={profile.picture || '/default-profile.png'}
            alt="Profile"
            className="profile-picture"
          />
        </div>
      </div>
      <div className="profile-details">
        <h2 className="username">{profile.username}</h2>
        <h3 className="tier">Tier: {profile.rank || 'Newbie'}</h3>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      <div className="badges-section">
        <h3>Your Badges</h3>
        {profile.badges && profile.badges.length > 0 ? (
          <div className="badges-container">
            {profile.badges.map((badge, index) => (
              <div key={index} className="badge">
                <img src={badge.imageUrl} alt={badge.name} />
                <span>{badge.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>You have no badges yet.</p>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ProfilePage;

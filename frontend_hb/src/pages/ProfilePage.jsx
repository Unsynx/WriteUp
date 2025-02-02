// src/components/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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

  // Trigger the hidden file input when the profile picture container is clicked
  const handleProfilePicClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle the file input change event
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/upload-profile-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Assuming the API returns the new picture URL in response.data.pictureUrl
      setProfile((prevProfile) => ({
        ...prevProfile,
        picture: response.data.pictureUrl,
      }));
    } catch (err) {
      setError('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  // ----- ADDED: Skeleton loader while profile data is loading -----
  if (!profile) {
    return (
      <div className="profile-skeleton">
        <div className="skeleton cover-skeleton"></div>
        <div className="skeleton avatar-skeleton"></div>
        <div className="skeleton text-skeleton"></div>
        <div className="skeleton text-skeleton"></div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="cover-image">
          {/* Update this with your desired cover image */}
        </div>
        <div
          className="profile-picture-container"
          onClick={handleProfilePicClick}
          title="Click to change profile picture"
        >
          {profile.picture ? (
            <img
              src={profile.picture}
              alt="Profile"
              className="profile-picture"
            />
          ) : (
            <div className="no-picture">
              <span className="plus-icon">+</span>
            </div>
          )}
          {uploading && <div className="uploading-overlay">Uploading...</div>}
        </div>
      </div>

      {/* ----- ADDED: Tier badge image container ----- */}
      <div className="tier-image-container">
        <img
          src="/assets/tier1.png"  // Adjust the path as needed
          alt="Tier 1 Badge"
          className="tier-image"
        />
      </div>

      {/* Hidden file input for image upload */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
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

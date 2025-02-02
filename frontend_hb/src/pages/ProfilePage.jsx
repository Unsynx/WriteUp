// src/components/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ProfilePage.css';
import ProgressDashboard from '../components/ProgressDashboard';

const ProfilePage = () => {
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
        console.log(response.data)
      } catch (err) {
        setError('Error fetching profile.');
      }
    };
    fetchProfile();
  }, []);

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

 
function average(array) {
  if (array.length === 0) return 0;
  return array.reduce((acc, c) => acc + c, 0) / array.length;
}

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
        <div className="tier-image-container">
          <img
            src={"src/assets/tier" + Math.floor((average(profile.elo_history) / 20) + 1) + ".svg"}
            alt="Tier 1 Badge"
            className="tier-image"
          />
        </div>
      </div>
      <ProgressDashboard elo_history={profile.elo_history}/>
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

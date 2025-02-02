// src/components/RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import "./LoginPage.css"

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errors = {};
    if (!username) errors.username = 'Username is required.';
    if (!email) {
      errors.email = 'Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = 'Invalid email format.';
      }
    }
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      await axios.post('http://localhost:5000/api/register', { username, email, password });
      navigate('/login');
    } catch (err) {
      setServerError('Error registering user. Email may already be in use.');
    }
  };

  return (

    <div className='log_con'>
      <div>
        <h2 className='text-4xl text-center mb-5'>Make an Account</h2>
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Username:</label>
            <input
              className='in'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email:</label>
            <input
              className='in'
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Password:</label>
            <input
              className='in'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
            {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
          </div>
          {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
          <button type="submit" className='login_button'>Register</button>
        </form>
        <p>
        Already have an account? <Link to="/login" className='regis_l'>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
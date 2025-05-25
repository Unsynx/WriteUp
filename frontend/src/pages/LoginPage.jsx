// src/components/LoginPage.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ setIsAuthenticated, setUsername }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // ----- CHANGED: Real-time validation -----
  const validateFields = (field, value) => {
    let message = '';
    if (field === 'email') {
      if (!value) {
        message = 'Email is required.';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          message = 'Invalid email format.';
        }
      }
    } else if (field === 'password') {
      if (!value) {
        message = 'Password is required.';
      } else if (value.length < 6) {
        message = 'Password must be at least 6 characters.';
      }
    }
    return message;
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateFields('email', value) }));
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: validateFields('password', value) }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError('');

    // Re-check any final validation before submission
    const emailMsg = validateFields('email', email);
    const passwordMsg = validateFields('password', password);

    if (emailMsg || passwordMsg) {
      setErrors({ email: emailMsg, password: passwordMsg });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('username', response.data.username);
      setIsAuthenticated(true);
      setUsername(response.data.username);
    } catch (err) {
      setServerError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className='full_section_white'>
      <div className="log_con">
      <div>
        <h2 className="text-4xl text-center mb-5">Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email:</label>
            <input
              className="in"
              type="email"
              value={email}
              onChange={handleEmailChange}
              style={{ width: '100%', padding: '0.5rem' }}
            />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Password:</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                className="in"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                style={{ width: '100%', padding: '0.5rem' }}
              />
              {/* ----- CHANGED: Password visibility toggle ----- */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
          </div>
          {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
          <button type="submit" className="login_button">Login</button>
        </form>
        <p>
          Don’t have an account? <Link to="/register" className="regis_l">Register</Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;

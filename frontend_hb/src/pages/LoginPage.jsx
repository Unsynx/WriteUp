// src/components/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import "./LoginPage.css"

const LoginPage = ({ setIsAuthenticated, setUsername }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errors = {};
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('username', response.data.username);
      setIsAuthenticated(true);
      setUsername(response.data.username);

      if (response.data.initial_placement === 'true') {
        navigate('/profile');
      } else {
        navigate('/placement');
      }

    } catch (err) {
      setServerError('Invalid credentials. Please try again.');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      navigate('/profile');
    }
  })

  return (
    <div className='log_con'>
      <div>
        <h2 className='text-4xl text-center mb-5'>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit" className='login_button'>Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register" className='regis_l'>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

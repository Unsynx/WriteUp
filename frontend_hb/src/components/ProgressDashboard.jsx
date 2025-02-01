// src/components/ProgressDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProgressDashboard = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State for adding a new data point
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  // Fetch existing data from the backend
  const fetchProgressData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/progress', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChartData(response.data);
    } catch (err) {
      console.error('Error fetching progress data:', err);
      setError('Error fetching progress data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  // Add a new data point via a POST request
  const handleAddData = async (e) => {
    e.preventDefault();
    if (!newLabel || !newValue) {
      alert('Please enter both a label and a value.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Example payload: { label: "Week 5", value: 90 }
      const payload = { label: newLabel, value: parseFloat(newValue) };
      await axios.post('http://localhost:5000/api/progress/add', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // After successful POST, fetch the updated data
      fetchProgressData();
      // Clear the form fields
      setNewLabel('');
      setNewValue('');
    } catch (err) {
      console.error('Error adding new data point:', err);
      alert('Error adding data point. Check console or try again.');
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Your Writing Progress' },
    },
  };

  // Loading / Error / No-data states
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading progress data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!chartData) {
    return null;
  }

  return (
    <div style={{ width: '100%', padding: '2rem', boxSizing: 'border-box' }}>
      <h2>Progress Dashboard</h2>
      <Line data={chartData} options={options} />

      {/* Form for adding new data points */}
      <div style={{ marginTop: '2rem' }}>
        <h3>Add New Data Point</h3>
        <form onSubmit={handleAddData} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', maxWidth: '400px' }}>
          <div style={{ flex: '1 1 100%' }}>
            <label>Label:</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="E.g., Week 5"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <div style={{ flex: '1 1 100%' }}>
            <label>Value:</label>
            <input
              type="number"
              step="any"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="E.g., 90"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <button type="submit" style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>
            Add Data
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProgressDashboard;

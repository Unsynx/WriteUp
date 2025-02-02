// src/components/ProgressDashboard.jsx
import React, { useState, useEffect } from 'react';
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

const ProgressDashboard = ({elo_history}) => {
  // Dummy data for demonstration.
  const [chartData, setChartData] = useState({
    datasets: [
      {
        label: 'Vocabulary Growth',
        data: elo_history,
        borderColor: 'black',
        backgroundColor: 'rgba(3, 169, 244, 0.2)',
        tension: 0.3,
      }
    ]
  });

  // In a real implementation, you would fetch this data from the backend.
  useEffect(() => {
    // Example: axios.get('/api/progress').then(...)
    // For now, we use the dummy chartData defined above.
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2>ELO Over Time</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ProgressDashboard;

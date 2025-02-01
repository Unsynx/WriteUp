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

const ProgressDashboard = () => {
  // Dummy data for demonstration.
  const [chartData, setChartData] = useState({
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Vocabulary Growth',
        data: [50, 65, 80, 95],
        borderColor: '#03a9f4',
        backgroundColor: 'rgba(3, 169, 244, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Grammar Accuracy (%)',
        data: [70, 75, 80, 85],
        borderColor: '#4a148c',
        backgroundColor: 'rgba(74, 20, 140, 0.2)',
        tension: 0.3,
      },
    ],
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
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Writing Progress',
      },
    },
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2>Progress Dashboard</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ProgressDashboard;

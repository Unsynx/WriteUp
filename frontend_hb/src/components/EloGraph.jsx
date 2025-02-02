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

const EloGraph = ({ elo_history }) => {
  const [chartData, setChartData] = useState({
    labels: elo_history.map((_, index) => index + 1), // Initial labels based on history length
    datasets: [
      {
        label: 'Score',
        data: elo_history,
        borderColor: 'black',
        backgroundColor: 'rgba(3, 169, 244, 0.2)',
        tension: 0.3,
      }
    ]
  });

  useEffect(() => {
    setChartData((prev) => ({
      ...prev,
      labels: elo_history.map((_, index) => index + 1), // Updating labels dynamically
      datasets: [
        {
          ...prev.datasets[0], // Keeping previous styles and properties
          data: elo_history, // Updating only the data
        }
      ]
    }));
  }, [elo_history]);

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

export default EloGraph;

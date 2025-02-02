// src/components/DynamicGraph.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './DynamicGraph.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DynamicGraph = ({ dataPoints }) => {
  // Create labels for each point (e.g., "Point 1", "Point 2", ...)
  const labels = dataPoints.map((_, index) => `Point ${index + 1}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Data Points',
        data: dataPoints,
        fill: false,
        borderColor: '#03a9f4',
        backgroundColor: '#03a9f4',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // allows the chart to fill the container height
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'IBM Plex Mono', monospace",
          },
        },
      },
      title: {
        display: true,
        text: 'Dynamic Graph',
        font: {
          family: "'IBM Plex Mono', monospace",
          size: 18,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Data Point Index',
          font: {
            family: "'IBM Plex Mono', monospace",
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
          font: {
            family: "'IBM Plex Mono', monospace",
            size: 14,
          },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dynamic-graph-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default DynamicGraph;

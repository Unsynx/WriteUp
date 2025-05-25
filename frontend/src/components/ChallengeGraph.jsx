import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChallengeGraph = ({ values }) => {
  // Define bin size
  const binSize = 5;
  const bins = Array.from({ length: 21 }, (_, i) => i * binSize); // Bins: 0-5, 5-10, ..., 95-100

  // Count values in each bin
  const binCounts = new Array(bins.length).fill(0);
  values.forEach(value => {
    const binIndex = Math.min(Math.floor(value / binSize), bins.length - 1);
    binCounts[binIndex]++;
  });

  // Chart Data
  const data = {
    labels: bins.map((bin, i) => `${bin}-${bin + binSize - 1}`), // Label bins
    datasets: [
      {
        label: "Frequency",
        data: binCounts,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { title: { display: true, text: "Value Ranges" },
            label: {display: false},
            ticks: {
                autoSkip: true, // Ensures every label is displayed
                stepSize: 1, // Forces the axis to show single values instead of ranges
                }
    },
      y: { title: { display: false}, 
            beginAtZero: true,
            ticks: {
                display: false // Hides y-axis labels
              },
        },
    },

  };

  return (
    <div>
        <h2 className="text-center">Other User's Placement</h2>
        <Bar data={data} options={options} />
    </div>
  )
  
};

export default ChallengeGraph;

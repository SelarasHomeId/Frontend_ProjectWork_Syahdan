// src/components/PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Daftarkan komponen yang diperlukan oleh Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  // Data untuk Pie Chart
  const chartData = {
    labels: ['Instagram', 'TikTok'], // Label sosial media
    datasets: [
      {
        data: [data.instagram, data.tiktok], // Data jumlah klik
        backgroundColor: ['#E1306C', '#69C9D0'], // Warna untuk tiap bagian pie chart
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="pie-chart-container">
      <h4>Customer Engagement</h4>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;

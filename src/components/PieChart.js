import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Daftarkan komponen yang diperlukan oleh Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: ['#E1306C', '#69C9D0', '#7FFF00', '#00008B'],
        hoverOffset: 2,
      },
    ],
  };

  return (
    <div
    className="pie-chart-container"
    style={{
      width: '100%',
      maxWidth: '600px',    /* ubah di sini kalau ingin chart desktop lebih besar */
      height: 'auto',
      margin: '0 auto'      /* center container */
    }}
    >
      <Pie data={chartData} />
    </div>
  );
};


export default PieChart;

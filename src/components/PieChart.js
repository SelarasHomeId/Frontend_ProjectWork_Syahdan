import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, height = 1000 }) => {
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      className="w-100"
      style={{
        height: `${height}px`,
      }}
    >
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
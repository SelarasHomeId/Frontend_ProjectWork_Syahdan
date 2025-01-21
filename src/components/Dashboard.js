// src/pages/Dashboard.js
import React, { useState } from 'react';
import PieChart from '../components/PieChart';

function Dashboard() {
  // Data untuk pie chart, bisa kamu ambil dari API atau state lokal
  const [data, setData] = useState({
    instagram: 200, // jumlah klik Instagram
    tiktok: 150, // jumlah klik TikTok
  });

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="charts">
        {/* Pie chart untuk sosial media */}
        <div className="chart">
          <h3>Instagram vs TikTok</h3>
          <PieChart data={data} />
        </div>
        {/* Pie chart lainnya, misalnya untuk data sosial media lainnya */}
        <div className="chart">
          <h3>Platform Engagement</h3>
          <PieChart data={{ instagram: 300, tiktok: 100 }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

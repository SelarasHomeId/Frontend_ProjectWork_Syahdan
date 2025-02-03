// src/pages/Dashboard.js
import React, { useState } from 'react';
import PieChart from '../components/PieChart';
import '../styles/Dashboard.css'; // Pastikan file CSS diimpor

function Dashboard() {
  // Data untuk pie chart, bisa kamu ambil dari API atau state lokal
  const [data, setData] = useState({
    instagram: 200, // jumlah klik Instagram
    tiktok: 150, // jumlah klik TikTok
  });

  const platformData = {
    instagram: 300,
    tiktok: 100,
    youtube: 250, // Data tambahan untuk memperluas chart
    twitter: 180, // Platform lain
  };

  return (
    <div className="dashboard">
      <h3 className="dashboard-title">Dashboard</h3>
      <div className="charts">
        {/* Pie chart untuk sosial media */}
        <div className="chart">
          <h4>Instagram vs TikTok</h4>
          <PieChart data={data} />
        </div>
        {/* Pie chart lainnya, misalnya untuk data sosial media lainnya */}
        <div className="chart">
          <h4>Platform Engagement</h4>
          <PieChart data={platformData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
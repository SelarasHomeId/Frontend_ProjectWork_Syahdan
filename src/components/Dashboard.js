// src/pages/Dashboard.js
import React, { useState } from 'react';
import PieChart from '../components/PieChart';
import '../styles/Dashboard.css'; // Pastikan file CSS diimpor

function Dashboard() {
  // Data untuk pie chart sebelah kiri (Instagram, WA, TikTok, dan Facebook)
  const [socialMediaData, setSocialMediaData] = useState({
    instagram: 200, // jumlah klik Instagram
    whatsapp: 180,  // jumlah klik WhatsApp
    tiktok: 150,    // jumlah klik TikTok
    facebook: 120,  // jumlah klik Facebook
  });

  // Data untuk pie chart sebelah kanan (Contact dan Affiliate)
  const [contactAffiliateData, setContactAffiliateData] = useState({
    contact: 300,   // jumlah kontak
    affiliate: 250, // jumlah affiliate
  });

  return (
    <div className="dashboard">
      <h3 className="dashboard-title">Dashboard</h3>
      <div className="charts">
        {/* Pie chart untuk sosial media (sebelah kiri) */}
        <div className="chart">
          <h4>Instagram, WA, TikTok, Facebook</h4>
          <PieChart data={socialMediaData} />
        </div>
        {/* Pie chart untuk contact dan affiliate (sebelah kanan) */}
        <div className="chart">
          <h4>Contact & Affiliate</h4>
          <PieChart data={contactAffiliateData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

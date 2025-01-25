// src/pages/RecommendedHomes.js
import React from 'react';
import { Link } from 'react-router-dom';
import './RecommendedHomes.css'; // Pastikan Anda membuat file CSS ini

const RecommendedHomes = () => {
  const homes = [
    {
      id: 1,
      image: 'assets/../itemrumah.jpg',
      title: 'Rumah Modern',
      description: '3 Kamar Tidur, 2 Kamar Mandi, Lokasi Strategis',
    },
    {
      id: 2,
      image: '/path/to/house2.jpg',
      title: 'Rumah Minimalis',
      description: '2 Kamar Tidur, 1 Kamar Mandi, Dekat dengan Sekolah',
    },
    {
      id: 3,
      image: '/path/to/house3.jpg',
      title: 'Rumah Keluarga',
      description: '4 Kamar Tidur, 3 Kamar Mandi, Lingkungan Nyaman',
    },
  ];

  return (
    <div className="recommended-homes">
      <h2>Rumah Rekomendasi Kami</h2>
      <div className="homes-container">
        {homes.map((home) => (
          <div key={home.id} className="home-card">
            <Link to={`/homes/${home.id}`}>
              <img src={home.image} alt={home.title} className="home-image" />
              <h3>{home.title}</h3>
              <p>{home.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedHomes;

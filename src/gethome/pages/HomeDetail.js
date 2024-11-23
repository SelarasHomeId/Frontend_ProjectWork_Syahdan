// src/pages/HomeDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';

const HomeDetail = () => {
  const { id } = useParams(); // Mendapatkan id rumah dari URL

  // Di sini Anda bisa mengambil data rumah berdasarkan id dan menampilkannya
  return (
    <div>
      <h2>Detail Rumah ID: {id}</h2>
      {/* Tampilkan detail rumah di sini */}
    </div>
  );
};

export default HomeDetail;

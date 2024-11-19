// src/pages/Beli.js
import React, { useState } from 'react';
import './Beli.css';
import bannerbeli1Image from '../assets/bannerbeli1.jpg';
import bannerbeli2Image from '../assets/bannerbeli2.jpg';
import bannerbeli3Image from '../assets/bannerbeli3.jpg';
import leftButtonImage from '../assets/left.png';
import nextButtonImage from '../assets/next.png';

function Beli() {
  const [currentIndex, setCurrentIndex] = useState(0); // State untuk indeks gambar

  // Array gambar banner
  const banners = [bannerbeli1Image, bannerbeli2Image, bannerbeli3Image];

  // Fungsi untuk menggeser ke gambar berikutnya
  const nextBanner = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  // Fungsi untuk menggeser ke gambar sebelumnya
  const prevBanner = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  return (
    <div>
      {/* Banner */}
      <div className="banner-container">
        <div
          className="banner-wrapper"
          style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease' }}
        >
          {banners.map((banner, index) => (
            <img key={index} src={banner} alt={`Banner ${index + 1}`} className="banner-image" />
          ))}
        </div>
        <button className="button-icon" onClick={prevBanner}>
          <img src={leftButtonImage} alt="Sebelumnya" />
        </button>
        <button className="button-icon" onClick={nextBanner}>
          <img src={nextButtonImage} alt="Berikutnya" />
        </button>
      </div>

      {/* Konten Beli */}
      <div className="content">
        <h2>Temukan Properti Impian Anda</h2>
        <p>Gunakan fitur pencarian kami untuk menemukan properti yang sesuai dengan kebutuhan Anda.</p>
      </div>
    </div>
  );
}

export default Beli;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';
import Homebaner1Image from '../assets/Homebaner1.jpg';
import Homebaner2Image2 from '../assets/Homebaner2.jpg';
import HomebanerImage3 from '../assets/Homebaner3.jpg';
import HomeImage from '../assets/Home3.png';
import Home2Image from '../assets/Home2.png';
import supportImage from '../assets/support.png';
import leftButtonImage from '../assets/left.png';
import nextButtonImage from '../assets/next.png';

function Homepage() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Array gambar banner
    const banners = [Homebaner1Image, Homebaner2Image2, HomebanerImage3];

    // Array rekomendasi properti
    const recommendedProperties = [
        {
            id: 1,
            name: "Rumah Tipe A",
            location: "Jakarta",
            price: "Rp 500 juta",
            image: HomeImage, // Gambar rumah sebenarnya
        },
        {
            id: 2,
            name: "Rumah Tipe B",
            location: "Bandung",
            price: "Rp 750 juta",
            image: Home2Image, // Gambar rumah sebenarnya
        },
        // Tambahkan lebih banyak properti jika diperlukan
    ];

    // Fungsi untuk menggeser ke gambar berikutnya
    const nextBanner = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    // Fungsi untuk menggeser ke gambar sebelumnya
    const prevBanner = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    };

    return (
        <div className="homepage">
            {/* Banner */}
            <div className="banner-container">
                <Link to="/beli" className="banner-link">
                    <div className="banner-wrapper" style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease' }}>
                        {banners.map((banner, index) => (
                            <img key={index} src={banner} alt={`Banner ${index + 1}`} className="banner-image" />
                        ))}
                    </div>
                </Link>
                <button className="button-icon" onClick={prevBanner}>
                    <img src={leftButtonImage} alt="Sebelumnya" />
                </button>
                <button className="button-icon" onClick={nextBanner}>
                    <img src={nextButtonImage} alt="Berikutnya" />
                </button>
            </div>

            {/* Icon Section */}
            <div className="icon-section">
                <div className="icon">
                    <Link to="/beli">
                        <img src={HomeImage} alt="Beli" />
                        <p>Beli Rumah</p>
                    </Link>
                </div>
                <div className="icon">
                    <Link to="/properties">
                        <img src={Home2Image} alt="Properti" />
                        <p>Properti Tersedia</p>
                    </Link>
                </div>
                <div className="icon">
                    <Link to="/contact">
                        <img src={supportImage} alt="Hubungi Kami" />
                        <p>Hubungi Kami</p>
                    </Link>
                </div>
            </div>

           {/* Rekomendasi Rumah */}
<div className="recommendations-section">
    <h2>Rumah Rekomendasi</h2>
    <div className="recommendations-grid">
        {recommendedProperties.map((property) => (
            <Link key={property.id} to={`/property/${property.id}`} className="property-card">
                <h3>{property.name}</h3>
                <p>{property.location}</p>
                <p>{property.price}</p>
                <div className="view-details">Lihat Detail</div>
            </Link>
        ))}
    </div>
</div>

        </div>
    );
}

export default Homepage;

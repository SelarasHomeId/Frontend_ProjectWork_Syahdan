import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages/styles/Homepage.css';
import Homebaner1Image from '../assets/img/Homebaner1.jpg';
import Homebaner2Image2 from '../assets/img/Homebaner2.jpg';
import HomebanerImage3 from '../assets/img/Homebaner3.jpg';
import HomeImage from '../assets/img/HomeExample3.jpg';
import Home2Image from '../assets/img/HomeExample.jpg';
import Home3Image from '../assets/img/HomeExample1.jpg';  // Gambar rumah tambahan
import Home4Image from '../assets/img/HomeExample2.jpg';  // Gambar rumah tambahan
import supportImage from '../assets/img/support.png';
import leftButtonImage from '../assets/img/left.png';
import nextButtonImage from '../assets/img/next.png';
import HouseImage from '../assets/img/Home3.png';

function Homepage() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Array gambar banner
    const banners = [Homebaner1Image, Homebaner2Image2, HomebanerImage3];

    // Array rekomendasi properti dengan properti tambahan "availableUnits"
    const recommendedProperties = [
        {
            id: 1,
            name: "Rumah Tipe A",
            location: "Jakarta",
            price: "Rp 500 juta",
            availableUnits: 5, // Tambahkan jumlah unit tersedia
            image: HomeImage,
        },
        {
            id: 2,
            name: "Rumah Tipe B",
            location: "Bandung",
            price: "Rp 750 juta",
            availableUnits: 2, // Tambahkan jumlah unit tersedia
            image: Home2Image,
        },
        {
            id: 3,
            name: "Rumah Tipe C",
            location: "Surabaya",
            price: "Rp 600 juta",
            availableUnits: 0, // Properti baru (habis terjual)
            image: Home3Image,
        },
        {
            id: 4,
            name: "Rumah Tipe D",
            location: "Yogyakarta",
            price: "Rp 650 juta",
            availableUnits: 8, // Properti baru
            image: Home4Image,
        },
        {
            id: 4,
            name: "Rumah Tipe E",
            location: "Bekasi",
            price: "Rp 700 juta",
            availableUnits: 8, // Properti baru
            image: Home4Image,
        },
        {
            id: 4,
            name: "Rumah Tipe F",
            location: "Semarang",
            price: "Rp 750 juta",
            availableUnits: 8, // Properti baru
            image: Home4Image,
        },
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
                    <div
                        className="banner-wrapper"
                        style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                            transition: 'transform 0.5s ease',
                        }}
                    >
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
                        <img src={HouseImage} alt="Beli" />
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
            <img src={property.image} alt={property.name} className="property-image" />
            <h3>{property.name}</h3>
            <p>{property.location}</p>
            <p>{property.price}</p>
            <p>
                Sisa Unit: {property.availableUnits > 0 ? property.availableUnits : 'Habis'}
            </p>
            <div className="view-details">Lihat Detail</div>
        </Link>
    ))}
</div>

            </div>

            {/* Kotak Konsultasi */}
            <div className="consultation-box">
                <h3>Konsultasi</h3>
                <p>
                    Jika Anda memiliki pertanyaan atau pengaduan, silakan klik tombol di bawah ini untuk menghubungi
                    kami melalui WhatsApp.
                </p>
                <a
                    href="https://wa.me/6281234567890" // Ganti dengan nomor WhatsApp Anda
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-button"
                >
                    Pengaduan via WhatsApp
                </a>
            </div>
        </div>
    );
}

export default Homepage;

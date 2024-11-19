// src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Homepage from './pages/Homepage'; // Halaman utama
import Contact from './pages/Contact'; // Halaman Kontak
import About from './pages/About'; // Halaman Tentang Kami
import Beli from './pages/Beli'; // Halaman Beli
import Properties from './pages/Properties'; // Halaman Properti
import HomeDetail from './pages/HomeDetail'; // Halaman Detail Rumah
import Lainnya from './pages/Lainnya';
import Login from './pages/Login';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        {/* Rute untuk halaman utama */}
        <Route path="/" element={<Homepage />} />
        {/* Rute untuk halaman Kontak */}
        <Route path="/contact" element={<Contact />} />
        {/* Rute untuk halaman Tentang Kami */}
        <Route path="/about" element={<About />} />
        {/* Rute untuk halaman Beli */}
        <Route path="/beli" element={<Beli />} />
        {/* Rute untuk halaman Properti */}
        <Route path="/properties" element={<Properties />} />
        {/* Rute untuk halaman Detail Rumah */}
        <Route path="/homes/:id" element={<HomeDetail />} />
        {/* Rute untuk halaman Lainnya, menggunakan komponen Kontak */}
        <Route path="/lainnya" element={<Lainnya />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </div>
  );
}

export default App;

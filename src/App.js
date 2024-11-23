import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './gethome/components/Navbar'; // Komponen Navbar
import Homepage from './gethome/pages/Homepage'; // Halaman utama
import Contact from './gethome/pages/Contact'; // Halaman Kontak
import About from './gethome/pages/About'; // Halaman Tentang Kami
import Beli from './gethome/pages/Beli'; // Halaman Beli
import Properties from './gethome/pages/Properties'; // Halaman Properti
import HomeDetail from './gethome/pages/HomeDetail'; // Halaman Detail Rumah
import Lainnya from './gethome/pages/Lainnya'; // Halaman untuk Lainnya
import Profile from './gethome/pages/Profile'; // Halaman Profil
import Settings from './gethome/pages/Settings'; // Halaman Pengaturan
import Help from './gethome/pages/Help'; // Halaman Bantuan

function App() {
  return (
    <div className="App">
      {/* Navbar akan muncul di setiap halaman */}
      <Navbar />
      <Routes>
        {/* Rute untuk halaman utama */}
        <Route path="/" element={<Homepage />} />
        {/* Rute untuk halaman Beli */}
        <Route path="/beli" element={<Beli />} />
        {/* Rute untuk halaman Tentang Kami */}
        <Route path="/about" element={<About />} />
        {/* Rute untuk halaman Kontak */}
        <Route path="/contact" element={<Contact />} />
        {/* Rute untuk halaman Properti */}
        <Route path="/properties" element={<Properties />} />
        {/* Rute untuk halaman Detail Rumah */}
        <Route path="/homes/:id" element={<HomeDetail />} />
        {/* Rute untuk halaman Lainnya */}
        <Route path="/lainnya" element={<Lainnya />} />
        {/* Rute untuk halaman Profil */}
        <Route path="/profile" element={<Profile />} />
        {/* Rute untuk halaman Pengaturan */}
        <Route path="/settings" element={<Settings />} />
        {/* Rute untuk halaman Bantuan */}
        <Route path="/help" element={<Help />} />
      </Routes>
    </div>
  );
}

export default App;

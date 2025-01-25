import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../components/styles/Navbar.css'; // pastikan path ini benar sesuai struktur project Anda

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fungsi untuk toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  // Tutup dropdown jika pengguna mengklik di luar elemen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">SelarasHome</Link>
      </div>
      <ul className="navbar-right">
        <li><Link to="/beli">Beli</Link></li>
        <li><Link to="/about">Tentang Kami</Link></li>
        <li><Link to="/contact">Kontak</Link></li>
        <li className="dropdown" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className={`dropdown-toggle ${dropdownOpen ? 'active' : ''}`}
          >
            Lainnya
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              <li><Link to="/profile">Profil</Link></li>
              <li><Link to="/settings">Pengaturan</Link></li>
              <li><Link to="/help">Bantuan</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

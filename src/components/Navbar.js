// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => {
      const newState = !prevState;
      console.log("Dropdown state:", newState); // Log setelah perubahan state
      return newState;
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">SelarasHome</Link>
      </div>
      <ul className="navbar-right">
        <li><Link to="/beli">Beli</Link></li>
        <li><Link to="/about">Tentang Kami</Link></li>
        <li><Link to="/contact">Kontak</Link></li>
        <li className="dropdown">
          <button onClick={toggleDropdown} className="dropdown-toggle">
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

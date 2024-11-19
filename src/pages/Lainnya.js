// src/pages/Lainnya.js
import React, { useState } from 'react';

function Lainnya() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div>
      <h2>Halaman Lainnya</h2>
      <p>Ini adalah halaman lainnya. Anda bisa menambahkan informasi yang diperlukan di sini.</p>
      
      <div className="dropdown-container">
        <button onClick={toggleDropdown} className="dropdown-btn">
          Pilih Opsi
        </button>
        {dropdownOpen && (
          <ul className="dropdown-menu">
            <li>Opsi 1</li>
            <li>Opsi 2</li>
            <li>Opsi 3</li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Lainnya;

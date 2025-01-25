// src/pages/Properties.js
import React, { useState, useEffect } from 'react';

function Properties() {
  const [properties, setProperties] = useState([]);

  // Mengambil data properti dari API saat komponen di-render
  useEffect(() => {
    // Ganti 'URL_API_PROPERTI' dengan URL API yang sesuai
    fetch('URL_API_PROPERTI')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setProperties(data))
      .catch(error => {
        console.error('Error fetching properties:', error);
        // Jika fetch gagal, set properti default untuk pengujian
        const fetchedProperties = [
          { id: 1, name: 'Properti 1' },
          { id: 2, name: 'Properti 2' },
          { id: 3, name: 'Properti 3' },
        ];
        setProperties(fetchedProperties);
      });
  }, []);

  return (
    <div>
      <h2>Daftar Properti</h2>
      <ul>
        {properties.map(property => (
          <li key={property.id}>{property.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Properties;

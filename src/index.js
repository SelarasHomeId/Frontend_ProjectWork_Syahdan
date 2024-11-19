// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './assets/styles/index.css'; // Pastikan jalur ini benar sesuai lokasi file CSS
import App from './App'; // Mengimpor komponen App

// Membuat root menggunakan React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Merender aplikasi dengan Router
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

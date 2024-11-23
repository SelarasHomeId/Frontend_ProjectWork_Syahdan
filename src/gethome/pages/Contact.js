// src/pages/Contact.js
import React, { useState } from 'react';
import '../pages/styles/Contact.css'; // Pastikan file CSS terhubung

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi pengiriman data
    console.log('Data form:', formData);
    setSubmitted(true);
  };

  return (
    <div className="contact-container">
      <h2>Gabung Sebagai Agen</h2>
      <p>
        Dapatkan komisi jutaan rupiah menjadi agen properti di selarashome
      </p>
      <ul>
        <li>Email: contact@selarashome.com</li>
        <li>Telepon: +62 123 456 789</li>
        <li>Alamat: Jl. Rumah Idaman No. 12, Jakarta</li>
      </ul>

      {!submitted ? (
        <div className="contact-form">
          <h3>Kirim Pesan</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nama Lengkap:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Pesan:</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Lanjut</button>
          </form>
        </div>
      ) : (
        <div className="thank-you-message">
          <h3>Terima kasih!</h3>
          <p>Dengan ini saya menyetujui Syarat dan Ketentuan dan Kebijakan Privasi yang berlaku</p>
        </div>
      )}
    </div>
  );
}

export default Contact;

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAllRole } from '../service/apiService';

const Role = () => {
  const [roles, setRoles] = useState([]);
 

  const fetchRoles = async () => {
    try {
      const response = await getAllRole(`/role`);
      setRoles(response.data.data);
     
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  
  return (
    <div className="container-fluid px-3 py-4">
     {/* Header Section */}
      <header className="text-center mb-5" style={{ padding: '2rem ', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <p className="lead" style={{
          fontSize: '1.25rem',
          color: '#6c757d',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1'
        }}>
          "Pengelolaan akses pengguna yang terintegrasi dengan pembagian role berdasarkan wewenang dan tanggung jawab masing-masing posisi."
        </p>
      </header>

      {/* Grid Roles */}
      <div className="row justify-content-center">
        {roles.map((role) => (
          <div 
            key={role.id}
            className="col-12 col-md-8 col-lg-6 col-xl-4 mb-4"
          >
            <div 
              className="h-100 p-4 rounded-3 shadow-lg text-center"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e9ecef',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              <h2 
                className="mb-3"
                style={{
                  color: '#2b2d42',
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  letterSpacing: '0.5px'
                }}
              >
                {role.name}
              </h2>
              <p
                className="mx-auto"
                style={{
                  color: '#6c757d',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  maxWidth: '300px'
                }}
              >
                {role.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Role;
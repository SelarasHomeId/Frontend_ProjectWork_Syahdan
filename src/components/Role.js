import React, { useState, useEffect } from 'react';
import '../styles/Role.css';
import { getAllRole } from '../service/apiService';

const Role = () => {
  // State untuk menyimpan data role, pagination, dan pencarian
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // Batas data per halaman

  // Fetch data dari API dengan pagination dan search query
  const fetchRoles = async (page = 1, query = '') => {
    try {
      const response = await getAllRole(`/role?page=${page}&limit=${itemsPerPage}&search=${query}`);
      setRoles(response.data.data); // Sesuaikan dengan struktur respons dari API
      
      // Hitung total halaman
      const totalData = response.data.count; // Total data dari API
      setTotalPages(Math.ceil(totalData / itemsPerPage)); // Hitung total halaman
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Panggil fetchRoles saat komponen pertama kali dimuat atau saat currentPage / searchQuery berubah
  useEffect(() => {
    fetchRoles(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  // Fungsi untuk navigasi halaman
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="role-table-container">
      {/* Fitur pencarian */}
      <input
        type="text"
        placeholder="Search by Role Name"
        value={searchQuery}
        onChange={e => {
          setSearchQuery(e.target.value);
          setCurrentPage(1); // Reset ke halaman pertama saat mencari
        }}
        className="search-bar"
      />

      {/* Tabel */}
      <table className="role-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Role Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {roles != null ? (
            roles.map((role, index) => (
              <tr key={role.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{role.name}</td>
                <td>{role.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No roles found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Tombol prev dan next */}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <button onClick={nextPage} disabled={currentPage >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Role;

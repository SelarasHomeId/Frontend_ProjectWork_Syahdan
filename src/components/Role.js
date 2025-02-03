import React, { useState } from 'react';
import '../styles/Role.css'; // Pastikan file CSS ini ada di dalam folder yang sama

const RoleTable = () => {
  // Contoh data role
  const roles = [
    { id: 1, name: 'Admin', description: 'Manages all aspects of the app' },
    { id: 2, name: 'User', description: 'Regular user with limited access' },
    { id: 3, name: 'Manager', description: 'Manages tasks and users' },
    { id: 4, name: 'Developer', description: 'Works on app development' },
    { id: 5, name: 'Designer', description: 'Designs UI/UX for the app' },
    { id: 6, name: 'Tester', description: 'Tests the app for bugs' },
    { id: 7, name: 'Support', description: 'Provides customer support' },
    // Tambah data lebih banyak jika diperlukan
  ];

  // State untuk pagination dan pencarian
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 5;

  // Fungsi untuk menghitung data yang ditampilkan berdasarkan halaman
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoles = roles.slice(indexOfFirstItem, indexOfLastItem);

  // Filter berdasarkan pencarian
  const filteredRoles = currentRoles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fungsi untuk mengubah halaman
  const nextPage = () => {
    if (currentPage < Math.ceil(roles.length / itemsPerPage)) {
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
        onChange={e => setSearchQuery(e.target.value)}
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
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role, index) => (
              <tr key={role.id}>
                <td>{indexOfFirstItem + index + 1}</td>
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
        <button
          onClick={nextPage}
          disabled={currentPage === Math.ceil(roles.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RoleTable;

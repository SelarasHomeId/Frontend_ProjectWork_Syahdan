import React, { useState } from 'react';
import '../styles/User.css';

const User = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', division: 'Marketing', loginStatus: 'Online', lockedStatus: 'Unlocked', created: '2025-01-20' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', division: 'Legal', loginStatus: 'Offline', lockedStatus: 'Locked', created: '2025-01-15' },
  ]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [modalType, setModalType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', division: '' });

  // Filter users berdasarkan pencarian
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Tambah User
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.division) return;
    const newUserData = {
      id: users.length + 1,
      ...newUser,
      loginStatus: 'Offline',
      lockedStatus: 'Unlocked',
      created: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUserData]);
    setModalType(null);
    setNewUser({ name: '', email: '', role: '', division: '' });
  };

  // Edit User
  const handleEditUser = () => {
    setUsers(users.map(user => (user.id === selectedUser.id ? { ...user, ...newUser } : user)));
    setModalType(null);
    setNewUser({ name: '', email: '', role: '', division: '' });
  };

  // Delete User
  const handleDeleteUser = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <div className="user-container">
      <div className="table-header">
        <input type="text" className="search-input" placeholder="Search by name or email" value={search} onChange={handleSearchChange} />
        <button className="add-button" onClick={() => setModalType('add')}>Add User</button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Division</th>
            <th>Login Status</th>
            <th>Locked Status</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length === 0 ? (
            <tr>
              <td colSpan="9">No users found</td>
            </tr>
          ) : (
            currentUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1 + indexOfFirstItem}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.division}</td>
                <td>{user.loginStatus}</td>
                <td>{user.lockedStatus}</td>
                <td>{user.created}</td>
                <td>
                  <button className="action-button" onClick={() => {
                    setModalType('edit');
                    setSelectedUser(user);
                    setNewUser(user);
                  }}>Edit</button>
                  <button className="action-button" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                  <button className="action-button">Reset Pass</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={handlePrevPage} className="pagination-button" disabled={currentPage === 1}>Prev</button>
        <button onClick={handleNextPage} className="pagination-button" disabled={currentPage >= Math.ceil(filteredUsers.length / itemsPerPage)}>Next</button>
      </div>

      {/* Modal untuk tambah & edit */}
      {modalType && (
        <div className="modal">
          <div className="modal-content">
            <h3>{modalType === 'add' ? 'Add User' : 'Edit User'}</h3>
            <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="Enter name" className="modal-input" />
            <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="Enter email" className="modal-input" />
            <input type="text" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} placeholder="Enter role" className="modal-input" />
            <input type="text" value={newUser.division} onChange={(e) => setNewUser({ ...newUser, division: e.target.value })} placeholder="Enter division" className="modal-input" />
            <div className="modal-actions">
              <button className="save-button" onClick={modalType === 'add' ? handleAddUser : handleEditUser}>Save</button>
              <button className="cancel-button" onClick={() => setModalType(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;

import React, { useState, useEffect, useCallback  } from 'react';
import debounce from 'lodash.debounce';
import '../styles/Division.css';
import { getAllDivision, addDivision, updateDivision, deleteDivision } from '../service/apiService';

const Division = () => {
  const [divisi, setDivisions] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [modalType, setModalType] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [newDivision, setNewDivision] = useState({ name: '', email: '', role: '', division: '' });
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchDivisions = useCallback(async () => {
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await getAllDivision(`/divisi?limit=${itemsPerPage}&offset=${offset}&search=${search}`);
  
      if (response.success) {
        setDivisions(response.data.data);
        setHasNextPage(offset + itemsPerPage < response.data.count);
      }
    } catch (error) {
      console.error('Error fetching divisi:', error);
    }
  }, [currentPage, search, itemsPerPage]);
  
  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  const handleSearchChange = debounce((value) => {
    setSearch(value);
    setCurrentPage(1);
  }, 500);

  const handlePagination = (direction) => {
    setCurrentPage((prev) => Math.max(1, prev + direction));
  };

  const openModal = (type, divisi = null) => {
    setModalType(type);
    setSelectedDivision(divisi);
    setNewDivision(divisi || { name: '', email: '', role: '', division: '' });
  };

  const handleDivisionSubmit = async () => {
    if (!newDivision.name || !newDivision.email || !newDivision.role || !newDivision.division) return;
    try {
      const response = modalType === 'add' ? await addDivision(newDivision) : await updateDivision(selectedDivision.id, newDivision);
      if (response.success) {
        fetchDivisions();
        setModalType(null);
      }
    } catch (error) {
      console.error('Error submitting divisi:', error);
    }
  };

  const handleDeleteDivision = async (id) => {
    if (window.confirm('Are you sure you want to delete this divisi?')) {
      try {
        const response = await deleteDivision(id);
        if (response.success) fetchDivisions();
      } catch (error) {
        console.error('Error deleting divisi:', error);
      }
    }
  };

  return (
    <div className="divisi-container">
      <div className="table-header">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search by division name" 
          onChange={(e) => handleSearchChange(e.target.value)} 
        />
        <button className="add-button" onClick={() => openModal('add')}>Add Division</button>
      </div>

      <table className="divisi-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Division Name</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {divisi.length === 0 ? (
            <tr>
              <td colSpan="7">No divisi found</td>
            </tr>
          ) : (
            divisi.map((divisi, index) => (
              <tr key={divisi.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{divisi.name}</td>
                <td>{divisi.created_at}</td>
                <td>
                  <button className="action-button btn btn-warning" onClick={() => openModal('edit', divisi)}>Edit</button>
                  <button className="action-button btn btn-danger" onClick={() => handleDeleteDivision(divisi.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => handlePagination(-1)} className="pagination-button" disabled={currentPage === 1}>Prev</button>
        <button onClick={() => handlePagination(1)} className="pagination-button" disabled={!hasNextPage}>Next</button>
      </div>

      {modalType && (
        <div className="modal">
          <div className="modal-content">
            <h3>{modalType === 'add' ? 'Add Division' : 'Edit Division'}</h3>
            <input type="text" value={newDivision.name} onChange={(e) => setNewDivision({ ...newDivision, name: e.target.value })} placeholder="Enter name" className="modal-input" />
            <input type="email" value={newDivision.email} onChange={(e) => setNewDivision({ ...newDivision, email: e.target.value })} placeholder="Enter email" className="modal-input" />
            <input type="text" value={newDivision.role} onChange={(e) => setNewDivision({ ...newDivision, role: e.target.value })} placeholder="Enter role" className="modal-input" />
            <input type="text" value={newDivision.division} onChange={(e) => setNewDivision({ ...newDivision, division: e.target.value })} placeholder="Enter division" className="modal-input" />
            <div className="modal-actions">
              <button className="save-button" onClick={handleDivisionSubmit}>Save</button>
              <button className="cancel-button" onClick={() => setModalType(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Division;
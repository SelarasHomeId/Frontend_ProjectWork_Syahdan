import React, { useState, useEffect } from "react";
import "../styles/Division.css";

const Division = () => {
  const [divisions, setDivisions] = useState([
    { id: 1, name: "Marketing", created: "2025-01-20" },
    { id: 2, name: "Legal", created: "2025-01-15" },
    { id: 3, name: "Accounting", created: "2025-01-10" },
  ]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [modalType, setModalType] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [newDivisionName, setNewDivisionName] = useState("");

  // Debugging perubahan state divisions
  useEffect(() => {
    console.log("Updated Divisions:", divisions);
  }, [divisions]);

  // Filter data berdasarkan pencarian
  const filteredDivisions = divisions.filter((division) =>
    division.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDivisions = filteredDivisions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredDivisions.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Tambah Division
  const handleAddDivision = () => {
    if (newDivisionName.trim() === "") {
      alert("Division name cannot be empty!");
      return;
    }

    // Pastikan ID selalu unik
    const newId =
      divisions.length > 0 ? Math.max(...divisions.map((d) => d.id)) + 1 : 1;

    const newDivision = {
      id: newId,
      name: newDivisionName,
      created: new Date().toISOString().split("T")[0],
    };

    console.log("Adding Division:", newDivision);
    setDivisions([...divisions, newDivision]);
    setNewDivisionName("");
    setModalType(null);
  };

  // Edit Division
  const handleEditDivision = () => {
    if (newDivisionName.trim() === "") {
      alert("Division name cannot be empty!");
      return;
    }

    setDivisions(
      divisions.map((div) =>
        div.id === selectedDivision.id ? { ...div, name: newDivisionName } : div
      )
    );
    setNewDivisionName("");
    setModalType(null);
  };

  // Delete Division
  const handleDeleteDivision = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this division?"
    );
    if (confirmDelete) {
      setDivisions(divisions.filter((div) => div.id !== id));
    }
  };

  return (
    <div className="division-container">
      <div className="table-header">
        <input
          type="text"
          className="search-input"
          placeholder="Search by division"
          value={search}
          onChange={handleSearchChange}
        />
        <button className="add-button" onClick={() => setModalType("add")}>
          Add Division
        </button>
      </div>

      <table className="division-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Division Name</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentDivisions.length === 0 ? (
            <tr>
              <td colSpan="4">No divisions found</td>
            </tr>
          ) : (
            currentDivisions.map((division, index) => (
              <tr key={division.id}>
                <td>{index + 1 + indexOfFirstItem}</td>
                <td>{division.name}</td>
                <td>{division.created}</td>
                <td>
                  <button
                    className="action-button"
                    onClick={() => {
                      setModalType("edit");
                      setSelectedDivision(division);
                      setNewDivisionName(division.name);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="action-button"
                    onClick={() => handleDeleteDivision(division.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={handlePrevPage}
          className="pagination-button"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <button
          onClick={handleNextPage}
          className="pagination-button"
          disabled={
            currentPage >= Math.ceil(filteredDivisions.length / itemsPerPage)
          }
        >
          Next
        </button>
      </div>

      {/* Modal untuk tambah & edit */}
      {modalType && (
        <div className="modal">
          <div className="modal-content">
            <h3>{modalType === "add" ? "Add Division" : "Edit Division"}</h3>
            <input
              type="text"
              value={newDivisionName}
              onChange={(e) => setNewDivisionName(e.target.value)}
              placeholder="Enter division name"
              className="modal-input"
            />
            <div className="modal-actions">
              <button
                className="save-button"
                onClick={modalType === "add" ? handleAddDivision : handleEditDivision}
              >
                Save
              </button>
              <button
                className="cancel-button"
                onClick={() => setModalType(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Division;

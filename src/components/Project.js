import React, { useState, useEffect } from "react";
import "../styles/Project.css";

const Project = () => {
  const [divisions, setProjects] = useState([
    { id: 1, name: "Marketing", created: "2025-01-20" },
    { id: 2, name: "Legal", created: "2025-01-15" },
    { id: 3, name: "Accounting", created: "2025-01-10" },
  ]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [modalType, setModalType] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");

  // Debugging perubahan state divisions
  useEffect(() => {
    console.log("Updated Projects:", divisions);
  }, [divisions]);

  // Filter data berdasarkan pencarian
  const filteredProjects = divisions.filter((division) =>
    division.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredProjects.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Tambah Project
  const handleAddProject = () => {
    if (newProjectName.trim() === "") {
      alert("Project name cannot be empty!");
      return;
    }

    // Pastikan ID selalu unik
    const newId =
      divisions.length > 0 ? Math.max(...divisions.map((d) => d.id)) + 1 : 1;

    const newProject = {
      id: newId,
      name: newProjectName,
      created: new Date().toISOString().split("T")[0],
    };

    console.log("Adding Project:", newProject);
    setProjects([...divisions, newProject]);
    setNewProjectName("");
    setModalType(null);
  };

  // Edit Project
  const handleEditProject = () => {
    if (newProjectName.trim() === "") {
      alert("Project name cannot be empty!");
      return;
    }

    setProjects(
      divisions.map((div) =>
        div.id === selectedProject.id ? { ...div, name: newProjectName } : div
      )
    );
    setNewProjectName("");
    setModalType(null);
  };

  // Delete Project
  const handleDeleteProject = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this division?"
    );
    if (confirmDelete) {
      setProjects(divisions.filter((div) => div.id !== id));
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
          Add Project
        </button>
      </div>

      <table className="division-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Project Name</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.length === 0 ? (
            <tr>
              <td colSpan="4">No divisions found</td>
            </tr>
          ) : (
            currentProjects.map((division, index) => (
              <tr key={division.id}>
                <td>{index + 1 + indexOfFirstItem}</td>
                <td>{division.name}</td>
                <td>{division.created}</td>
                <td>
                  <button
                    className="action-button"
                    onClick={() => {
                      setModalType("edit");
                      setSelectedProject(division);
                      setNewProjectName(division.name);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="action-button"
                    onClick={() => handleDeleteProject(division.id)}
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
            currentPage >= Math.ceil(filteredProjects.length / itemsPerPage)
          }
        >
          Next
        </button>
      </div>

      {/* Modal untuk tambah & edit */}
      {modalType && (
        <div className="modal">
          <div className="modal-content">
            <h3>{modalType === "add" ? "Add Project" : "Edit Project"}</h3>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter division name"
              className="modal-input"
            />
            <div className="modal-actions">
              <button
                className="save-button"
                onClick={modalType === "add" ? handleAddProject : handleEditProject}
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

export default Project;

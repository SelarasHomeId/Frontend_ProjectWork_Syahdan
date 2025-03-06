import React, { useState, useEffect, useCallback  } from 'react';
import debounce from 'lodash.debounce';
import '../styles/Project.css';
import { getAllProject, addProject, updateProject, deleteProject } from '../service/apiService';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [modalType, setModalType] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProject, setNewProject] = useState({ name: ''});
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await getAllProject(`/project?limit=${itemsPerPage}&offset=${offset}&search=${search}`);
  
      if (response.success) {
        setProjects(response.data.data);
        setHasNextPage(offset + itemsPerPage < response.data.count);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, [currentPage, search, itemsPerPage]);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearchChange = debounce((value) => {
    setSearch(value);
    setCurrentPage(1);
  }, 500);

  const handlePagination = (direction) => {
    setCurrentPage((prev) => Math.max(1, prev + direction));
  };

  const openModal = (type, project = null) => {
    setModalType(type);
    setSelectedProject(project);
    setNewProject(project || { name: '', email: '', role: '', division: '' });
  };

  const handleProjectSubmit = async () => {
    if (!newProject.name || !newProject.email || !newProject.role || !newProject.division) return;
    try {
      const response = modalType === 'add' ? await addProject(newProject) : await updateProject(selectedProject.id, newProject);
      if (response.success) {
        fetchProjects();
        setModalType(null);
      }
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await deleteProject(id);
        if (response.success) fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="project-container">
      <div className="table-header">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search by project name" 
          onChange={(e) => handleSearchChange(e.target.value)} 
        />
        <button className="add-button" onClick={() => openModal('add')}>Add Project</button>
      </div>

      <table className="project-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Project Name</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan="7">No projects found</td>
            </tr>
          ) : (
            projects.map((project, index) => (
              <tr key={project.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{project.name}</td>
                <td>{project.created_at}</td>
                <td>
                  <button className="action-button btn btn-warning" onClick={() => openModal('edit', project)}>Edit</button>
                  <button className="action-button btn btn-danger" onClick={() => handleDeleteProject(project.id)}>Delete</button>
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
            <h3>{modalType === 'add' ? 'Add Project' : 'Edit Project'}</h3>
            <input type="text" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} placeholder="Enter name" className="modal-input" />
            <input type="email" value={newProject.email} onChange={(e) => setNewProject({ ...newProject, email: e.target.value })} placeholder="Enter email" className="modal-input" />
            <input type="text" value={newProject.role} onChange={(e) => setNewProject({ ...newProject, role: e.target.value })} placeholder="Enter role" className="modal-input" />
            <input type="text" value={newProject.division} onChange={(e) => setNewProject({ ...newProject, division: e.target.value })} placeholder="Enter division" className="modal-input" />
            <div className="modal-actions">
              <button className="save-button" onClick={handleProjectSubmit}>Save</button>
              <button className="cancel-button" onClick={() => setModalType(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;

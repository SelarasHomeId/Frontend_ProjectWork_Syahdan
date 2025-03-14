import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import '../styles/Project.css';
import { getAllProject, addProject, updateProject, deleteProject, getProjectById } from '../service/apiService';
import Swal from "sweetalert2";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
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

const handleAddProject = async () => {
    try {
      const { value: formValues } = await Swal.fire({
        title: "Add Project",
        html: `
          <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
            <label for="swal-name">Name:</label>
            <input id="swal-name" type="text" class="swal2-input" placeholder="Input name">
            
            <label for="swal-location">Location:</label>
            <input id="swal-location" type="text" class="swal2-input" placeholder="Input location">

            <label for="swal-cover">Cover:</label>
            <input id="swal-cover" type="file" class="swal2-input" accept="image/*">
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          const name = document.getElementById("swal-name").value;
          const location = document.getElementById("swal-location").value;
          const coverInput = document.getElementById("swal-cover").files[0];
          if (!name) {
            Swal.showValidationMessage("Nama project tidak boleh kosong!");
            return false;
          }
          if (!location) {
            Swal.showValidationMessage("Location tidak boleh kosong!");
            return false;
          }
          return { name, location, coverInput};
        },
      });
  
      if (formValues) {
        let cover = null;
        if ( formValues.coverInput) {
            cover = formValues.coverInput;
        }
        const response = await addProject({ 
          name: formValues.name, 
          location: formValues.location,
          cover: cover, 
        });
  
        if (response.success) {
          Swal.fire({
            title: "Berhasil!",
            text: "Project berhasil ditambahkan.",
            icon: "success",
            confirmButtonText: "OK",
          }).then( async () => {
            await fetchProjects();
          });
        } else {
          Swal.fire({
            title: "Gagal!",
            text: response.error.data.message || "Terjadi kesalahan.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Terjadi Kesalahan",
        text: "Gagal mengambil data. Mohon coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

const handleEditProject = async (id) => {
    try {
      const projectDataRes = await getProjectById(id);
      const projectData = projectDataRes.data.data;

      const { value: formValues } = await Swal.fire({
        title: "Edit Project",
        html: `
          <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
            <label for="swal-name">Name:</label>
            <input id="swal-name" type="text" class="swal2-input" placeholder="Input name" value="${projectData.name}">

            <label for="swal-location">Location:</label>
            <input id="swal-location" type="text" class="swal2-input" placeholder="Input location" value="${projectData.location}">

            <label for="swal-cover">Cover:</label>
            <input id="swal-cover" type="file" class="swal2-input" accept="image/*">
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Update",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          const name = document.getElementById("swal-name").value;
          const location = document.getElementById("swal-location").value;
          const coverInput = document.getElementById("swal-cover").files[0];

          const updatedData = {};

          if (name !== projectData.name) updatedData.name = name;
          if (location !== projectData.location) updatedData.location = location;
          if (coverInput) {
            updatedData.cover = coverInput;
          }

          if (!name) {
            Swal.showValidationMessage("Nama tidak boleh kosong!");
            return false;
          }
          
          return updatedData;
        },
      });

        if (formValues && Object.keys(formValues).length > 0) {
        
        const response = await updateProject(id, formValues);

        if (response.success) {
          Swal.fire({
            title: "Berhasil!",
            text: "Project berhasil diperbarui.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(async () => {
            await fetchProjects();
          });
        } else {
          Swal.fire({
            title: "Gagal!",
            text: response.error.data.message || "Terjadi kesalahan.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Terjadi Kesalahan",
        text: "Gagal mengambil data. Mohon coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };    

  const handleDeleteProject = async (id) => {
      try {
        const confirmDelete = await Swal.fire({
          title: "Konfirmasi Hapus",
          text: "Apakah Anda yakin ingin menghapus Project ini?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, Hapus",
          cancelButtonText: "Batal",
        });
  
        if (confirmDelete.isConfirmed) {
          const response = await deleteProject(id);
  
          if (response.success) {
            Swal.fire({
              title: "Berhasil!",
              text: "Project berhasil dihapus.",
              icon: "success",
              confirmButtonText: "OK",
            }).then(async () => {
              await fetchProjects();
            });
          } else {
            Swal.fire({
              title: "Gagal!",
              text: response.error.data.message || "Terjadi kesalahan.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        }
      } catch (error) {
        Swal.fire({
          title: "Terjadi Kesalahan",
          text: "Gagal menghapus Project. Mohon coba lagi.",
          icon: "error",
          confirmButtonText: "OK",
        });
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
        <button className="add-button" onClick={() => handleAddProject()}>Add Project</button>
      </div>

      <table className="project-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Project Name</th>
            <th>Location</th>
            <th>Has Cover</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects == null ? (
            <tr>
              <td colSpan="7">No projects found</td>
            </tr>
          ) : (
            projects.map((project, index) => (
              <tr key={project.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{project.name}</td>
                <td>{project.location}</td>
                <td>{project.cover != null ? "Yes" : "No"}</td>
                <td>{project.created_at.replace("T", " ").replace("Z", "")}</td>
                <td>
                  <button className="action-button btn btn-warning" onClick={() => handleEditProject(project.id)}>Edit</button>
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
    </div>
  );
};

export default Project;

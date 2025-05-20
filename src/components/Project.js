import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import '../styles/Project.css';
import { getAllProject, addProject, updateProject, deleteProject, getProjectById } from '../service/apiService';
import Swal from "sweetalert2";
import { Modal } from 'react-bootstrap';
import { MdEdit } from "react-icons/md";
import { deleteProjectCover } from '../service/apiService'; // pastikan path-nya sesuai


const Project = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedCover, setSelectedCover] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

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
        <div class="container-fluid" style="max-width: 500px;">
          <div class="row g-3 align-items-start">
            <div class="col-12">
              <div class="d-flex flex-column align-items-start">
                <label for="swal-name" class="form-label">Name</label>
                <input id="swal-name" type="text" class="form-control" placeholder="Input name" style="width: 100%;">
              </div>
            </div>

            <div class="col-12">
              <div class="d-flex flex-column align-items-start">
                <label for="swal-location" class="form-label">Location</label>
                <input id="swal-location" type="text" class="form-control" placeholder="Input location" style="width: 100%;">
              </div>
            </div>

            <div class="col-12">
              <div class="d-flex flex-column align-items-start">
                <label for="swal-cover" class="form-label">Cover</label>
                <input id="swal-cover" type="file" class="form-control" accept="image/*" style="width: 100%;">
              </div>
            </div>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit",
      confirmButtonColor:'#28a745',
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
        return { name, location, coverInput };
      },
    });

    if (formValues) {
      let cover = null;
      if (formValues.coverInput) {
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
        confirmButtonColor:'#28a745',
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
      // Fungsi isValidUrl untuk memvalidasi URL
      const isValidUrl = (string) => {
        try {
          new URL(string); // Mencoba membuat URL dari string
          return true;
        } catch (e) {
          return false; // Jika gagal, bukan URL
        }
      };

      const handleDeleteCover = async (projectId) => {
        const result = await Swal.fire({
          title: 'Apakah kamu yakin?',
          text: "Cover yang dihapus tidak bisa dikembalikan!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Ya, hapus saja!',
          cancelButtonText: 'Batal',
        });

        if (result.isConfirmed) {
          try {
            await deleteProjectCover(projectId);
            fetchProjects();
            setShowImagePreview(false);
            Swal.fire('Terhapus!', 'Cover berhasil dihapus.', 'success');
          } catch (error) {
            console.error('Gagal menghapus cover:', error);
            Swal.fire('Error!', 'Terjadi kesalahan saat menghapus cover.', 'error');
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
                  {!projects || projects.length === 0 ? (
                    <tr>
                      <td colSpan="7">No projects found</td>
                    </tr>
                  ) : (
                  projects.map((project, index) => (
                    <tr key={project.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{project.name}</td>
                      <td className="text-center">
                        {
                          isValidUrl(project.location) ? (
                            <a 
                              href={`${project.location}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                               <i className="fas fa-map-marker-alt fa-2x"></i>
                            </a>
                          ) : (
                            "No Location"
                          )
                        }
                      </td>
                      {/* Tombol preview tetap di dalam table */}
<td className='text-center'>
  {project.cover ? (
    <>
      <button 
        onClick={() => {
          setSelectedCover(project.cover.view_saved);
          setSelectedProjectId(project.id); // simpan id untuk delete
          setShowImagePreview(true);
        }}
        style={{ 
          background: 'none', 
          border: 'none', 
          padding: 0,
          cursor: 'pointer'
        }}
        title="Preview Gambar"
        aria-label="Preview Gambar"
      >
        <i 
          className="fas fa-image" 
          style={{ 
            fontSize: '1.5rem', 
            color: '#6c757d',
            transition: 'color 0.3s ease'
          }}
        />
      </button>
    </>
  ) : (
    "-"
  )}
</td>

{/* Modal Preview dengan tombol delete di header */}
<Modal show={showImagePreview} onHide={() => setShowImagePreview(false)}>
  <Modal.Header closeButton>
    <Modal.Title style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <span>Preview Cover</span>
      <button 
        onClick={() => handleDeleteCover(selectedProjectId)}
        style={{ 
          background: 'none', 
          border: 'none', 
          padding: 0,
          cursor: 'pointer',
          color: '#dc3545'
        }}
        title="Hapus Cover"
        aria-label="Hapus Cover"
      >
        <i className="fas fa-trash-alt" style={{ fontSize: '1.2rem' }} />
      </button>
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedCover ? (
      <img 
        src={selectedCover} 
        alt="Project Cover Preview" 
        style={{ width: '100%' }}
      />
    ) : (
      <p>URL gambar tidak valid</p>
    )}
  </Modal.Body>
</Modal>
                      <td>{project.created_at.replace("T", " ").replace("Z", "")}</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            className="action-button btn btn-warning d-flex align-items-center justify-content-center"
                            onClick={() => handleEditProject(project.id)}
                            aria-label="Edit"
                            style={{ width: '35px', height: '35px' }}
                          >
                            <MdEdit/>
                          </button>
                          <button 
                            className="btn btn-danger btn-sm p-2 d-flex align-items-center justify-content-center"
                            onClick={() => handleDeleteProject(project.id)}
                            style={{ width: '35px', height: '35px' }}
                            title="Delete"
                          >
                            <i className="fas fa-trash-alt fa-fw"></i>
                          </button>
                        </div>
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
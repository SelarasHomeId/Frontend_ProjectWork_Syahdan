import React, { useState, useEffect, useCallback  } from 'react';
import debounce from 'lodash.debounce';
import '../styles/Division.css';
import { getAllDivision, addDivision, updateDivision, deleteDivision, getDivisionById, processDownloadExcel } from '../service/apiService';
import Swal from "sweetalert2";
import { MdEdit } from 'react-icons/md';


const Division = () => {
  const [divisi, setDivisions] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);

  const fetchDivisions = useCallback(async () => {
    setIsLoadingFetch(true);
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
    setIsLoadingFetch(false);
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

  const handleAddDivision = async () => {
      try {
        const { value: formValues } = await Swal.fire({
          title: "Add Division",
          html: `
            <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
              <label for="swal-name">Name:</label>
              <input id="swal-name" type="text" class="swal2-input" placeholder="Input name">
            </div>
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: "Submit",
          cancelButtonText: "Cancel",
          preConfirm: () => {
            const name = document.getElementById("swal-name").value;  
            if (!name.trim()) {
              Swal.showValidationMessage("Nama tidak boleh kosong atau hanya berisi spasi!");
                return false;
              }
           
            const namePattern = /^[A-Za-z0-9\s]+$/;
            if (!namePattern.test(name)) {
              Swal.showValidationMessage("Tidak boleh di isi dengan character unik");
                return false;
              }
   
            return { name };
          },
        });
   
        if (formValues) {
          setIsLoading(true);
          const response = await addDivision({
            name: formValues.name,
          });
   
          if (response.success) {
            Swal.fire({
              title: "Berhasil!",
              text: "Division berhasil ditambahkan.",
              icon: "success",
              confirmButtonText: "OK",
            }).then( async () => {
              await fetchDivisions();
            });
          } else {
            Swal.fire({
              title: "Gagal!",
              text: response.error.data.message || "Terjadi kesalahan.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
          setIsLoading(false);
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

    const handleEditDivision = async (id) => {
        try {
          const divisionDataRes = await getDivisionById(id);
          const divisionData = divisionDataRes.data.data;
   
          const { value: formValues } = await Swal.fire({
            title: "Edit Divisi",
            html: `
              <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
                <input id="swal-name" type="text" class="swal2-input" placeholder="Input name" value="${divisionData.name}">
              </div>
            `,
            icon:'info',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor:'#28a745',
            cancelButtonText: "Cancel",
            preConfirm: () => {
              const name = document.getElementById("swal-name").value;
              const updatedData = {};
   
              if (name !== divisionData.name) updatedData.name = name;
              if (!name) {
                Swal.showValidationMessage("Nama division tidak boleh kosong!");
                return false;
              }

              return updatedData;
            },
          });
   
          if (formValues && Object.keys(formValues).length > 0) {
            setIsLoading(true);
            const response = await updateDivision(id, formValues);
   
            if (response.success) {
              Swal.fire({
                title: "Berhasil!",
                text: "Division berhasil diperbarui.",
                icon: "success",
                confirmButtonText: "OK",
              }).then(async () => {
                await fetchDivisions();
              });
            } else {
              Swal.fire({
                title: "Gagal!",
                text: response.error.data.message || "Terjadi kesalahan.",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
            setIsLoading(false);
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

  const handleDeleteDivision = async (id) => {
        try {
          const confirmDelete = await Swal.fire({
            title: "Konfirmasi Hapus",
            text: "Apakah Anda yakin ingin menghapus Division ini?",
            icon: "warning",
            iconColor:'#dc3545',
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            confirmButtonColor: '#dc3545',
            cancelButtonText: "Batal",
          });
   
          if (confirmDelete.isConfirmed) {
            const response = await deleteDivision(id);
   
            if (response.success) {
              Swal.fire({
                title: "Berhasil!",
                text: "Division berhasil dihapus.",
                icon: "success",
                confirmButtonText: "OK",
              }).then(async () => {
                await fetchDivisions();
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
            text: "Gagal menghapus Division. Mohon coba lagi.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      };

  const handleExportData = async () => {
    setIsLoading(true);
    await processDownloadExcel(`/divisi/export`)
    setIsLoading(false);
  }

  return (
    <div className="divisi-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner" />
        </div>
      )}
      <div className="table-header">
        <input
          type="text"
          className="search-input"
          placeholder="Search by division name"
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <div>
          <button className="unduh-button" style={{ marginRight: '10px' }} onClick={handleExportData}>
            Export Data
          </button>
          <button className="add-button" onClick={() => handleAddDivision()}>Add Division</button>
        </div>
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
          {divisi == null ? (
            <tr>
              <td colSpan="7">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  { isLoadingFetch ? 'Prepare your data' : 'No division found'}
                  {isLoadingFetch && <div className="mini-spinner" />}
                </span>
              </td>
            </tr>
          ) : (
            divisi.map((divisi, index) => (
              <tr key={divisi.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{divisi.name}</td>
                <td>{divisi.created_at.replace("T", " ").replace("Z", "")}</td>
                <td>
                  <button
                    className="action-button btn btn-warning me-2"
                    onClick={() => handleEditDivision(divisi.id)}
                    aria-label="Edit"
                  >
                    <MdEdit className="action-icon" />
                  </button>
                  <button
                    className="action-button btn btn-danger"
                    onClick={() => handleDeleteDivision(divisi.id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
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

export default Division;
import React, { useState, useEffect, useCallback  } from 'react';
import debounce from 'lodash.debounce';
import '../styles/User.css';
import { addUser, deleteUser, getAllDivision, getAllRole, getAllUser, getUserById, resetPasswordUser, updateUser } from '../service/apiService';
import Swal from "sweetalert2";
import { MdEdit } from "react-icons/md";

const User = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);

  const capitalize = (str) => str.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  const fetchUsers = useCallback(async () => {
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await getAllUser(`/user?limit=${itemsPerPage}&offset=${offset}&search=${search}`);
  
      if (response.success) {
        setUsers(response.data.data);
        setHasNextPage(offset + itemsPerPage < response.data.count);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [currentPage, search, itemsPerPage]);
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = debounce((value) => {
    setSearch(value);
    setCurrentPage(1);
  }, 500);

  const handlePagination = (direction) => {
    setCurrentPage((prev) => Math.max(1, prev + direction));
  };

  const handleAddUser = async () => {
  try {
    const [rolesRes, divisiRes] = await Promise.all([
      getAllRole("/role"),
      getAllDivision("/divisi"),
    ]);

    const roles = rolesRes.data.data || [];
    const divisions = divisiRes.data.data || [];

    const roleOptions = roles
      .map((role) => `<option value="${role.id}">${role.name}</option>`)
      .join("");
    const divisionOptions = divisions
      .map((div) => `<option value="${div.id}">${div.name}</option>`)
      .join("");

    const { value: formValues } = await Swal.fire({
      title: "Add User",
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
                <label for="swal-email" class="form-label">Email</label>
                <input id="swal-email" type="email" class="form-control" placeholder="Input email" style="width: 100%;">
              </div>
            </div>

            <div class="col-md-6">
              <div class="d-flex flex-column align-items-start">
                <label for="swal-role" class="form-label">Role</label>
                <select id="swal-role" class="form-select" style="width: 100%;">
                  <option value="" disabled selected>Select Role</option>
                  ${roleOptions}
                </select>
              </div>
            </div>

            <div class="col-md-6">
              <div class="d-flex flex-column align-items-start">
                <label for="swal-division" class="form-label">Division</label>
                <select id="swal-division" class="form-select" style="width: 100%;">
                  <option value="" disabled selected>Select Division</option>
                  ${divisionOptions}
                </select>
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
        const email = document.getElementById("swal-email").value;
        const role = document.getElementById("swal-role").value;
        const division = document.getElementById("swal-division").value;

        if (!name) {
          Swal.showValidationMessage("Nama tidak boleh kosong!");
          return false;
        }
        if (!email) {
          Swal.showValidationMessage("Email tidak boleh kosong!");
          return false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          Swal.showValidationMessage("Format email tidak valid!");
          return false;
        }
        if (!role) {
          Swal.showValidationMessage("Role harus dipilih!");
          return false;
        }
        if (!division) {
          Swal.showValidationMessage("Divisi harus dipilih!");
          return false;
        }

        return { name, email, role, division };
      },
    });

    if (formValues) {
      const response = await addUser({
        name: formValues.name,
        email: formValues.email,
        role_id: parseInt(formValues.role, 10),
        divisi_id: parseInt(formValues.division, 10),
      });

      if (response.success) {
        Swal.fire({
          title: "Berhasil!",
          text: "User berhasil ditambahkan, mohon cek email untuk mendapatkan akses aplikasi.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(async () => {
          await fetchUsers();
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

  const handleEditUser = async (id) => {
    try {
      const userDataRes = await getUserById(id);
      const userData = userDataRes.data.data;

      const [rolesRes, divisiRes] = await Promise.all([
        getAllRole("/role"),
        getAllDivision("/divisi"),
      ]);

      const roles = rolesRes.data.data || [];
      const divisions = divisiRes.data.data || [];

      const roleOptions = roles.map((role) => 
        `<option value="${role.id}" ${role.name === userData.role.name ? "selected" : ""}>${role.name}</option>`
      ).join("");
      
      const divisionOptions = divisions.map((div) => 
        `<option value="${div.id}" ${div.name === userData.divisi.name ? "selected" : ""}>${div.name}</option>`
      ).join("");

      const { value: formValues } = await Swal.fire({
      title: "Edit User",
      html: `
        <div class="container-fluid">
          <div class="row mb-3">
            <label for="swal-name" class="form-label col-12 text-sm-start">Name:</label>
            <div class="col-12">
              <input id="swal-name" type="text" class="form-control" placeholder="Input name" value="${userData.name}">
            </div>
          </div>
          <div class="row mb-3">
            <label for="swal-email" class="form-label col-12 text-sm-start">Email:</label>
            <div class="col-12">
              <input id="swal-email" type="email" class="form-control" placeholder="Input email" value="${userData.email}">
            </div>
          </div>
          <div class="row mb-3">
            <label for="swal-role" class="form-label col-12 text-sm-start">Role:</label>
            <div class="col-12">
              <select id="swal-role" class="form-select">
                <option value="" disabled>Select Role</option>
                ${roleOptions}
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <label for="swal-division" class="form-label col-12 text-sm-start">Division:</label>
            <div class="col-12">
              <select id="swal-division" class="form-select">
                <option value="" disabled>Select Division</option>
                ${divisionOptions}
              </select>
            </div>
          </div>
          <div class="row align-items-center">
            <label for="swal-is-locked" class="form-label col-6 text-sm-start">Status Locked:</label>
            <div class="col-6">
              <div class="form-check form-switch d-flex justify-content-end">
                <input id="swal-is-locked" type="checkbox" class="form-check-input" ${userData.is_locked ? "checked" : ""}>
              </div>
            </div>
          </div>
        </div>
        <style>
          .swal2-popup {
            max-width: 600px;
            width: 100%;
            padding: 1.5rem;
          }
          .form-label {
            font-weight: bold;
            font-size: 0.9rem;
          }
          @media (max-width: 768px) {
            .swal2-popup {
              padding: 1rem;
            }
            .form-label {
              font-size: 0.85rem;
            }
          }
        </style>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor:'#28a745',
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const name = document.getElementById("swal-name").value;
        const email = document.getElementById("swal-email").value;
        const role = document.getElementById("swal-role").value;
        const division = document.getElementById("swal-division").value;
        const isLocked = document.getElementById("swal-is-locked").checked;

        const updatedData = {};

        if (name !== userData.name) updatedData.name = name;
        if (email !== userData.email) updatedData.email = email;
        if (role && parseInt(role, 10) !== userData.role_id) updatedData.role_id = parseInt(role, 10);
        if (division && parseInt(division, 10) !== userData.divisi_id) updatedData.divisi_id = parseInt(division, 10);
        if (isLocked !== userData.is_locked) updatedData.is_locked = isLocked;

        if (!name) {
          Swal.showValidationMessage("Nama tidak boleh kosong!");
          return false;
        }
        if (!email) {
          Swal.showValidationMessage("Email tidak boleh kosong!");
          return false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          Swal.showValidationMessage("Format email tidak valid!");
          return false;
        }

        return updatedData;
      },
    });


      if (formValues && Object.keys(formValues).length > 0) {
        const response = await updateUser(id, formValues);

        if (response.success) {
          Swal.fire({
            title: "Berhasil!",
            text: "User berhasil diperbarui.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(async () => {
            await fetchUsers();
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

  const handleDeleteUser = async (id) => {
    try {
      const confirmDelete = await Swal.fire({
        title: "Konfirmasi Hapus",
        text: "Apakah Anda yakin ingin menghapus user ini?",
        icon: "warning",
        iconColor:'#dc3545',
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
        confirmButtonColor: "#dc3545",
      });

      if (confirmDelete.isConfirmed) {
        const response = await deleteUser(id);

        if (response.success) {
          Swal.fire({
            title: "Berhasil!",
            text: "User berhasil dihapus.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#28a745",
          }).then(async () => {
            await fetchUsers();
          });
        } else {
          Swal.fire({
            title: "Gagal!",
            text: response.error.data.message || "Terjadi kesalahan.",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#dc3545",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Terjadi Kesalahan",
        text: "Gagal menghapus user. Mohon coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ffc107",
      });
    }
  };

  const handleResetPassword = async (id) => {
    try {
      const confirmDelete = await Swal.fire({
        title: "Konfirmasi Reset Password",
        text: "Apakah Anda yakin ingin reset password untuk user ini?",
        icon: "warning",
        iconColor:'#dc3545',
        showCancelButton: true,
        confirmButtonText: "Ya, Reset",
        confirmButtonColor:'#dc3545',
        cancelButtonText: "Batal",
      });

      if (confirmDelete.isConfirmed) {
        const response = await resetPasswordUser(id);

        if (response.success) {
          Swal.fire({
            title: "Berhasil!",
            text: "Password User berhasil direset, mohon cek email untuk mendapatkan akses aplikasi.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(async () => {
            await fetchUsers();
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
        text: "Gagal menghapus user. Mohon coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="user-container">
      <div className="table-header">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search by name or email" 
          onChange={(e) => handleSearchChange(e.target.value)} 
        />
        <button className="add-button" onClick={() => handleAddUser()}>Add User</button>
      </div>

      <div className='table-responsive'>
        <table className="user-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Division</th>
              <th>Login From</th>
              <th>Locked Status</th>
              <th>Date Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users == null ? (
              <tr>
                <td colSpan="7">No users found</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role.name}</td>
                  <td>{user.divisi.name === "SelarasHomeId" ? "Management" : user.divisi.name}</td>
                  <td>{user.login_from === "" ? "-" : capitalize(user.login_from)}</td>
                  <td className={user.is_locked ? 'text-danger' : 'text-success'}>{user.is_locked ? "Locked" : "Unlocked"}</td>
                  <td>{user.created_at.replace("T", " ").replace("Z", "")}</td>
                  <td>
                  <div className="d-flex align-items-center gap-2">
                    {/* Edit Button */}
                    <button
                      className="action-button btn btn-warning d-flex align-items-center justify-content-center"
                      onClick={() => handleEditUser(user.id)}
                      aria-label="Edit"
                      style={{ width: '38px', height: '38px', padding: 0 }}
                    >
                      <MdEdit style={{ fontSize: '1.4rem' }} />
                    </button>
                    {/* Delete Button */}
                    <button 
                      className="btn btn-danger btn-sm p-2 d-flex align-items-center justify-content-center"
                      onClick={() => handleDeleteUser(user.id)}
                      style={{ width: '38px', height: '38px' }}
                      title="Delete"
                    >
                      <i className="fas fa-trash-alt fa-fw"></i>
                    </button>

                    {/* Reset Password Button */}
                    <button 
                      className="btn btn-secondary btn-sm p-2 d-flex align-items-center justify-content-center"
                      onClick={() => handleResetPassword(user.id)}
                      style={{ width: '38px', height: '38px' }}
                      title="Reset Password"
                    >
                      <i className="fas fa-key fa-fw"></i>
                    </button>
                  </div>
                </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={() => handlePagination(-1)} className="pagination-button" disabled={currentPage === 1}>Prev</button>
        <button onClick={() => handlePagination(1)} className="pagination-button" disabled={!hasNextPage}>Next</button>
      </div>
    </div>
  );
};

export default User;
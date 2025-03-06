import React, { useState, useEffect, useCallback  } from 'react';
import debounce from 'lodash.debounce';
import '../styles/User.css';
import { addUser, deleteUser, getAllDivision, getAllRole, getAllUser, getUserById, resetPasswordUser, updateUser } from '../service/apiService';
import Swal from "sweetalert2";

const User = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

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

      const roleOptions = roles.map((role) => `<option value="${role.id}">${role.name}</option>`).join("");
      const divisionOptions = divisions.map((div) => `<option value="${div.id}">${div.name}</option>`).join("");
  
      const { value: formValues } = await Swal.fire({
        title: "Add User",
        html: `
          <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
            <label for="swal-name">Name:</label>
            <input id="swal-name" type="text" class="swal2-input" placeholder="Input name">
            
            <label for="swal-email">Email:</label>
            <input id="swal-email" type="email" class="swal2-input" placeholder="Input email">
            
            <label for="swal-role">Role:</label>
            <select id="swal-role" class="swal2-input">
              <option value="" disabled selected>Select Role</option>
              ${roleOptions}
            </select>
            
            <label for="swal-division">Division:</label>
            <select id="swal-division" class="swal2-input">
              <option value="" disabled selected>Select Division  </option>
              ${divisionOptions}
            </select>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Submit",
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
          divisi_id: parseInt(formValues.division, 10)
        });
  
        if (response.success) {
          Swal.fire({
            title: "Berhasil!",
            text: "User berhasil ditambahkan, mohon cek email untuk mendapatkan akses aplikasi.",
            icon: "success",
            confirmButtonText: "OK",
          }).then( async () => {
            await fetchUsers();
          });
        } else {
          Swal.fire({
            title: "Gagal!",
            text: response.error?.message || "Terjadi kesalahan.",
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
          <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
            <label for="swal-name">Name:</label>
            <input id="swal-name" type="text" class="swal2-input" placeholder="Input name" value="${userData.name}">
            
            <label for="swal-email">Email:</label>
            <input id="swal-email" type="email" class="swal2-input" placeholder="Input email" value="${userData.email}">
            
            <label for="swal-role">Role:</label>
            <select id="swal-role" class="swal2-input">
              <option value="" disabled>Select Role</option>
              ${roleOptions}
            </select>
            
            <label for="swal-division">Division:</label>
            <select id="swal-division" class="swal2-input">
              <option value="" disabled>Select Division</option>
              ${divisionOptions}
            </select>

            <label for="swal-is-locked">Status Locked:</label>
            <label class="switch">
              <input id="swal-is-locked" type="checkbox" ${userData.is_locked ? "checked" : ""}>
              <span class="slider round"></span>
            </label>
          </div>
          <style>
            .switch {
              position: relative;
              display: inline-block;
              width: 34px;
              height: 20px;
            }
            .switch input {
              opacity: 0;
              width: 0;
              height: 0;
            }
            .slider {
              position: absolute;
              cursor: pointer;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: #ccc;
              transition: .4s;
              border-radius: 34px;
            }
            .slider:before {
              position: absolute;
              content: "";
              height: 14px;
              width: 14px;
              left: 3px;
              bottom: 3px;
              background-color: white;
              transition: .4s;
              border-radius: 50%;
            }
            input:checked + .slider {
              background-color: #2196F3;
            }
            input:checked + .slider:before {
              transform: translateX(14px);
            }
          </style>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Update",
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
            text: response.error?.message || "Terjadi kesalahan.",
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
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      });

      if (confirmDelete.isConfirmed) {
        const response = await deleteUser(id);

        if (response.success) {
          Swal.fire({
            title: "Berhasil!",
            text: "User berhasil dihapus.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(async () => {
            await fetchUsers();
          });
        } else {
          Swal.fire({
            title: "Gagal!",
            text: response.error?.message || "Terjadi kesalahan.",
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

  const handleResetPassword = async (id) => {
    try {
      const confirmDelete = await Swal.fire({
        title: "Konfirmasi Reset Password",
        text: "Apakah Anda yakin ingin reset password untuk user ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Reset",
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
            text: response.error?.message || "Terjadi kesalahan.",
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
            {users.length === 0 ? (
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
                    <button className="action-button btn btn-warning" onClick={() => handleEditUser(user.id)}>Edit</button>
                    <button className="action-button btn btn-danger" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    <button className="action-button btn btn-secondary" onClick={() => handleResetPassword(user.id)}>Reset Password</button>
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

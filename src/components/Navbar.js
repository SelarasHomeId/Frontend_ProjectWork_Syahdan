import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import { FaBars, FaBell, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { authLogout, changePassword} from "../service/apiService";
import Swal from "sweetalert2";
import { validatePassword } from "../utils/general";

function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  
  // State untuk menyimpan informasi user
  const [user, setUser] = useState({
    name: localStorage.getItem("name") || "",
    role: localStorage.getItem("roleName") || "",
    divisi: localStorage.getItem("divisiName") || "",
  });

  // State untuk notifikasi
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [notifications] = useState([
    "Pesan baru dari Admin",
    "Update tugas proyek terbaru",
    "Meeting dijadwalkan pukul 14:00",
  ]);
  const [isNotificationRead, setIsNotificationRead] = useState(false);

  // Update state jika localStorage berubah (misal setelah login)
  useEffect(() => {
    setUser({
      name: localStorage.getItem("name") || "",
      role: localStorage.getItem("roleName") || "",
      divisi: localStorage.getItem("divisiName") || "",
    });
  }, []);

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    setShowUserDropdown(false);
    if (!showNotificationDropdown) {
      console.log(isNotificationRead);
      setIsNotificationRead(true);
    }
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowNotificationDropdown(false);
  };

  const handleLogout = async () => {
    try {
      const response = await authLogout();
      if (response.success) {
        Swal.fire({
          title: "Berhasil Logout",
          text: "Sampai jumpa kembali...",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        }).then(() => {
          localStorage.clear();
          navigate("/");
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Gagal Logout, hubungi admin anda",
        text: error,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Change Password",
      html:
        '<input id="swal-oldPassword" type="oldPassword" class="swal2-input" placeholder="Masukkan password lama">' +
        '<input id="swal-newPassword" type="newPassword" class="swal2-input" placeholder="Masukkan password baru">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const oldPassword = document.getElementById("swal-oldPassword").value;
        const newPassword = document.getElementById("swal-newPassword").value;
  
        if (!oldPassword) {
          Swal.showValidationMessage("Password lama tidak boleh kosong!");
          return false;
        }
        if (!newPassword) {
          Swal.showValidationMessage("Password baru tidak boleh kosong!");
          return false;
        }
        if (oldPassword === newPassword) {
          Swal.showValidationMessage("Password baru tidak boleh sama dengan password lama!");
          return false;
        }
        const validationResult = validatePassword(newPassword);
        if (validationResult) {
          Swal.showValidationMessage(validationResult.toString());
          return false;
        }

        return { oldPassword, newPassword };
      },
    });
  
    if (formValues) {
      try {
        const response = await changePassword(formValues.oldPassword, formValues.newPassword);

        if (response.success) {
          Swal.fire({
            title: "Berhasil!",
            text: "Password Anda telah diubah.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Gagal Mengubah Password",
            text: response.error.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (err) {
        Swal.fire({
          title: "Terjadi Kesalahan",
          text: "Mohon coba lagi nanti atau hubungi admin.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };  

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          {/* Your logo or text */}
        </Link>

        {/* Burger Menu Button */}
        <button className="burger-menu-btn btn btn-dark position-absolute top-0 start-0" onClick={toggleSidebar}>
          <FaBars />
        </button>

        {/* Right side */}
        <div className="navbar-right">
          {/* Notification Icon */}
          <div
            className={`nav-item dropdown notification-wrapper ${showNotificationDropdown ? "active" : ""}`}
            onClick={toggleNotificationDropdown}
          >
            <FaBell className="icon notification-icon" />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
            {showNotificationDropdown && (
              <div className="dropdown-menu notification-dropdown">
                <h6 className="dropdown-header">Notifikasi</h6>
                {notifications.length > 0 ? (
                  notifications.map((notif, index) => (
                    <div key={index} className="dropdown-item">
                      {notif}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item">Tidak ada notifikasi</div>
                )}
              </div>
            )}
          </div>

          {/* User Icon and Info */}
          <div className={`nav-item dropdown user-section ${showUserDropdown ? "active" : ""}`} onClick={toggleUserDropdown}>
            <FaUser className="user-icon" />
            <div className="user-details">
              Hello, <span className="user-name">{user.name}</span>!
              <div className="user-role-divisi">
                <span>{user.role}</span> - <span>{user.divisi}</span>
              </div>
            </div>
            {showUserDropdown && (
              <div className="dropdown-menu user-dropdown">
                <Link className="dropdown-item" onClick={handleChangePassword}>
                  Change Password
                </Link>
                <div className="dropdown-item" onClick={handleLogout}>
                  Log Out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

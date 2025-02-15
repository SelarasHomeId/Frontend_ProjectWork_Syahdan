import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import { FaBars, FaBell, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { authLogout, changePassword, fetchNotifications, markNotificationAsRead } from "../service/apiService";
import Swal from "sweetalert2";
import { validatePassword } from "../utils/general";

function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    name: localStorage.getItem("name") || "",
    role: localStorage.getItem("roleName") || "",
    divisi: localStorage.getItem("divisiName") || "",
  });

  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      const response = await fetchNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    };
    loadNotifications();
  }, []);

  const toggleNotificationDropdown = async () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    setShowUserDropdown(false);

    if (!showNotificationDropdown && notifications.length > 0) {
      for (const notif of notifications) {
        await markNotificationAsRead(notif.id);
      }
      setNotifications([]);
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
    const { value: newPassword } = await Swal.fire({
      title: "Ganti Password",
      input: "password",
      inputPlaceholder: "Masukkan password baru",
      showCancelButton: true,
      confirmButtonText: "Ubah",
      cancelButtonText: "Batal",
      inputValidator: (value) => {
        if (!value) {
          return "Password tidak boleh kosong!";
        }
        if (!validatePassword(value)) {
          return "Password harus minimal 8 karakter, ada huruf besar, kecil, dan angka!";
        }
      },
    });

    if (newPassword) {
      try {
        const response = await changePassword(newPassword);
        if (response.success) {
          Swal.fire({
            title: "Sukses!",
            text: "Password berhasil diubah.",
            icon: "success",
            timer: 2500,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            title: "Gagal!",
            text: response.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Terjadi kesalahan saat mengganti password.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <button className="burger-menu-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>

        <div className="navbar-right d-flex align-items-center">
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
                    <div key={index} className="dropdown-item">{notif}</div>
                  ))
                ) : (
                  <div className="dropdown-item">Tidak ada notifikasi</div>
                )}
              </div>
            )}
          </div>

          <div
            className={`nav-item dropdown user-section ${showUserDropdown ? "active" : ""}`}
            onClick={toggleUserDropdown}
          >
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
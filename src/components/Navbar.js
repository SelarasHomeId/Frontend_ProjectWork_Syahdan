import React, { useState } from "react";
import "../styles/Navbar.css";
import { FaBars, FaBell, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { authLogout } from "../service/apiService";
import Swal from "sweetalert2";

function Navbar({ toggleSidebar }) {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [notifications] = useState([
    "Pesan baru dari Admin",
    "Update tugas proyek terbaru",
    "Meeting dijadwalkan pukul 14:00",
  ]);
  const [isNotificationRead, setIsNotificationRead] = useState(false); // Track apakah notifikasi sudah dibaca
  const navigate = useNavigate();

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    setShowUserDropdown(false);
    if (!showNotificationDropdown) {
      console.log(isNotificationRead);
      setIsNotificationRead(true); // Set notifikasi sebagai sudah dibaca
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
      })
    }
  };

  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          {/* Your logo or text */}
        </Link>

        {/* Burger Menu Button */}
        <button className="burger-menu-btn btn btn-dark position-absolute top-0 start-0" onClick={handleToggleSidebar}>
          {<FaBars/>}
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
              Hello <span className="user-name">{localStorage.getItem("name")}</span>!
              <div className="user-role-divisi">
                <span>{localStorage.getItem("roleName")}</span> - <span>{localStorage.getItem("divisiName")}</span>
              </div>
            </div>
            {showUserDropdown && (
              <div className="dropdown-menu user-dropdown">
                <Link to="/change-password" className="dropdown-item">
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

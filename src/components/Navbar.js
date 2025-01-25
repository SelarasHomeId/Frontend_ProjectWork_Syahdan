import React, { useState } from "react";
import "../styles/Navbar.css";
import { FaBell, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { authLogout } from "../service/apiService"; // Import logout dari apiService

function Navbar({ toggleSidebar }) {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate(); // Hook untuk navigasi

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    setShowUserDropdown(false); // Tutup dropdown user jika terbuka
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowNotificationDropdown(false); // Tutup dropdown notifikasi jika terbuka
  };

  const notifications = [
    "Pesan baru dari Admin",
    "Update tugas proyek terbaru",
    "Meeting dijadwalkan pukul 14:00",
  ];

  const handleLogout = async () => {
    try {
      const response = await authLogout();
      if (response.success) {
        localStorage.clear();
        alert(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed", error);
      alert("Gagal logout. Silakan coba lagi.");
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
        <button className="burger-menu-btn btn btn-dark" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>

        {/* Right side */}
        <div className="navbar-right">
          {/* Notification Icon */}
          <div
            className={`nav-item dropdown notification-wrapper ${showNotificationDropdown ? 'active' : ''}`}
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
          <div className="nav-item dropdown user-section" onClick={toggleUserDropdown}>
            <FaUser className="user-icon" />
            <div className="user-details">
              Hello <span className="user-name">{localStorage.getItem('name')}</span>!
              <div className="user-role-divisi">
                <span className="user-role">{localStorage.getItem('roleName')}</span> - <span className="user-divisi">{localStorage.getItem('divisiName')}</span>
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
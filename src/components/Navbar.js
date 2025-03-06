import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import { FaBars, FaBell, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { authLogout, changePassword, fetchNotifications, markNotificationAsRead } from "../service/apiService";
import Swal from "sweetalert2";
import { getCookie, removeAllCookies, validatePassword } from "../utils/general";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen, faEnvelope } from '@fortawesome/free-solid-svg-icons';

function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  
  const [user] = useState({
    name: getCookie("name") || "",
    role: getCookie("roleName") || "",
    divisi: getCookie("divisiName") || "",
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadNotif, setUnreadNotif] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    loadNotifications();
    if (!getCookie("id")) {
      Swal.fire({
        title: "Session anda telah berakhir.",
        text: "Sampai jumpa kembali...",
        icon: "success",
        timer: 2500,
        showConfirmButton: false,
      }).then(() => {
        removeAllCookies();
        navigate("/");
      });
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".notification-wrapper") &&
        !event.target.closest(".user-section")
      ) {
        setShowNotificationDropdown(false);
        setShowUserDropdown(false);
      }
    };
  
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);  
  
  const loadNotifications = async () => {
    const response = await fetchNotifications();
    if (response.success) {
      setNotifications(response.data.data);
      setUnreadNotif(response.data.count_unread)
    }
  };

  const toggleNotificationDropdown = async () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    setShowUserDropdown(false);
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
          removeAllCookies();
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
            text: "Password anda telah diubah.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Gagal mengubah password",
            text: response.error.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Terjadi Kesalahan",
          text: "Mohon coba lagi nanti atau hubungi admin.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleClickNotification = async (id) => {
    const response = await markNotificationAsRead(id);
    if (response.success) {
      loadNotifications();
    }
    
    setShowNotificationDropdown(false);
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
              <span className="notification-badge">{unreadNotif}</span>
            )}
            {showNotificationDropdown && (
              <div className="dropdown-menu notification-dropdown">
                <h6 className="dropdown-header">Notifikasi</h6>
                {notifications.length > 0 ? (
                  notifications.map((notif, index) => (
                    <li key={index} className="notification-item" onClick={() => handleClickNotification(notif.id)}>
                        {notif.is_read ? (
                            <span className="mr-2">
                                <FontAwesomeIcon icon={faEnvelopeOpen} className="notification-icon read" />
                            </span>
                        ) : (
                            <span className="mr-2">
                                <FontAwesomeIcon icon={faEnvelope} className="notification-icon unread" />
                            </span>
                        )}
                        <span>
                            {notif.title}<br/>  
                            <span className='notification-message'>
                                {notif.message}
                            </span>
                        </span>
                    </li>
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
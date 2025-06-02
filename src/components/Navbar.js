import React, { useState, useEffect, useRef, useCallback } from "react";
import "../styles/Navbar.css";
import { FaBars, FaBell, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { authLogout, changePassword, fetchNotifications, getTaskById, markNotificationAsRead, } from "../service/apiService";
import Swal from "sweetalert2";
import { removeAllCookies, validatePassword } from "../utils/general";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import LogoSelarasSidebar from "../assets/img/selarasBackground.jpg";
import Cookies from "js-cookie";
import notifSound from '../assets/notif_sound.ogg'
import { useBadge } from "./BadgeContext";
import { useCentrifuge } from "../service/webSocket"

function Navbar({ showSidebar, toggleNavbar, showDetailTask }) {
  const navigate = useNavigate();
 
  const [user] = useState({
    id: Cookies.get("id") || 0,
    name: Cookies.get("name") || "",
    role: Cookies.get("roleName") || "",
    divisi: Cookies.get("divisiName") || "",
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadNotif, setUnreadNotif] = useState(0);
  const [unreadNotifBefore, setUnreadNotifBefore] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const audioRef = useRef(new Audio(notifSound));
  const { setBadge, clearBadge } = useBadge();

  const loadNotifications = useCallback(async () => {
    const response = await fetchNotifications();
    if (response.success) {
      setNotifications(response.data.data);
      setUnreadNotifBefore(unreadNotif);
      setUnreadNotif(response.data.count_unread);
      document.title = response.data.count_unread > 0
        ? `(${response.data.count_unread}) SelarasHomeId`
        : `SelarasHomeId`;
      if (response.data.count_unread > 0) {
        setBadge(response.data.count_unread)
      } else {
        clearBadge()
      }
    }
  }, [unreadNotif, setBadge, clearBadge]);

  useEffect(() => {
    loadNotifications();
    if (!Cookies.get("id")) {
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
    if (unreadNotif > 0 && unreadNotif > unreadNotifBefore) {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          console.log("user didn't interact");
        });
      }
    }
  }, [navigate, unreadNotif, unreadNotifBefore, loadNotifications])

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

  useEffect(() => {
    setBadge(unreadNotif);
    return () => {
      document.title = `SelarasHomeId`;
      clearBadge();
    }
  }, [unreadNotif, setBadge, clearBadge]);

  const playAudioNotif = async () => {
    await loadNotifications();
    if (unreadNotif > 0 && unreadNotif > unreadNotifBefore) {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          console.log("user didn't interact");
        });
      }
    }
  }

  const handleDataReceive = (data) => {
    if (data) {
      if (data.is_new && data.count > unreadNotif) {
        playAudioNotif();
      }
    }
  }

  useCentrifuge({
    userId: user.id,
    onDataReceive: handleDataReceive,
  });

  const toggleNotificationDropdown = async () => {
    loadNotifications();
    setShowNotificationDropdown(!showNotificationDropdown);
    setShowUserDropdown(false);
  };

  const toggleUserDropdown = async () => {
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
      iconHtml: '<i class="fas fa-lock" style="font-size: 64px; color: #444;"></i>',
     
      title: "Change Password",
      html: `
        <div class="input-group mb-3" style="width: 100%;">
          <input id="swal-oldPassword" type="password" class="form-control" placeholder="Masukkan password lama">
          <span class="input-group-text" id="toggle-old" style="cursor: pointer;">
            <i class="bi bi-eye"></i>
          </span>
        </div>
        <div class="input-group mb-3" style="width: 100%;">
          <input id="swal-newPassword" type="password" class="form-control" placeholder="Masukkan password baru">
          <span class="input-group-text" id="toggle-new" style="cursor: pointer;">
            <i class="bi bi-eye"></i>
          </span>
        </div>
        <div class="input-group mb-3" style="width: 100%;">
          <input id="swal-confirmPassword" type="password" class="form-control" placeholder="Konfirmasi password baru">
          <span class="input-group-text" id="toggle-confirm" style="cursor: pointer;">
            <i class="bi bi-eye"></i>
          </span>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit",
      confirmButtonColor: '#218838',
      cancelButtonText: "Cancel",

      didOpen: () => {
      const setupToggle = (toggleId, inputId) => {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);
        toggle.addEventListener("click", () => {
          if (input.type === "password") {
            input.type = "text";
            toggle.querySelector("i").classList.replace("bi-eye", "bi-eye-slash");
          } else {
            input.type = "password";
            toggle.querySelector("i").classList.replace("bi-eye-slash", "bi-eye");
          }
        });
      };
      setupToggle("toggle-old", "swal-oldPassword");
      setupToggle("toggle-new", "swal-newPassword");
      setupToggle("toggle-confirm", "swal-confirmPassword");
      },

      preConfirm: () => {
        const oldPassword = document.getElementById("swal-oldPassword").value;
        const newPassword = document.getElementById("swal-newPassword").value;
        const confirmPassword = document.getElementById("swal-confirmPassword").value;

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
        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage("Password baru dan konfirmasi password tidak sama!");
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
          const logoutRes = await authLogout();
          if (logoutRes.success) {
            Swal.fire({
              title: "Berhasil!",
              text: "Password anda telah diubah.",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              removeAllCookies();
              navigate("/");
            });
          }
        } else {
          Swal.fire({
            title: "Gagal mengubah password",
            text: response.error.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch {
        Swal.fire({
          title: "Terjadi Kesalahan",
          text: "Mohon coba lagi nanti atau hubungi admin.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleClickNotification = async (id, taskId) => {
    const response = await markNotificationAsRead(id);
    if (response.success) {
      loadNotifications();
    }

    const responseTask = await getTaskById(taskId);
    if (responseTask.success){
      const task = responseTask.data.data
      if (taskId === 1 && task === null){
        Swal.fire({
          title: "For your information",
          text: "Notifikasi ini hanya sekedar informasi.",
          icon: "info",
          confirmButtonText: "OK",
        })
      } else if (task === null){
        Swal.fire({
          title: "Task not found",
          text: "Silakan hubungi admin anda!",
          icon: "error",
          confirmButtonText: "OK",
        })
      }else{
        showDetailTask(task)
      }
    }
   
    setShowNotificationDropdown(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ height: '90px', minHeight: '80px', maxHeight: '60px' }}>
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <button
          className="burger-menu-btn"
          onClick={toggleNavbar}
          style={{
            height: '48px',
            minHeight: '48px',
            maxHeight: '48px',
            padding: '0.5rem'
          }}
        >
        <FaBars />
        </button>
        {showSidebar && (
          <div
            className="sidebar-logo text-center clickable d-none d-lg-block"
            style={{ cursor: 'pointer' }}
          >
            {LogoSelarasSidebar ? (
              <img
                src={LogoSelarasSidebar}
                alt="Logo"
                className="img-fluid sidebar-logo-img"
                style={{ height: '40px', minHeight: '40px', maxHeight: '40px' }}
              />
            ) : (
              <div className="text-white">Logo Not Found</div>
            )}
          </div>
        )}
        <div className="navbar-right d-flex align-items-center">
          <div
            className={`nav-item notification-wrapper ${showNotificationDropdown ? "active" : ""}`}
            onClick={toggleNotificationDropdown}
          >
            <FaBell className="icon notification-icon" />
            {(unreadNotif > 0) && (
              <span className="notification-badge">{unreadNotif}</span>
            )}
              <div className={`notification-dropdown ${showNotificationDropdown?'show':''}`}>
                <h6 className="dropdown-header">Notifikasi</h6>
                {notifications != null ? (
                  notifications.map((notif, index) => (
                    <li key={index} className="notification-item" onClick={() => handleClickNotification(notif.id, notif.task_id)}>
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
          </div>

          <div
            className={`nav-item user-section ${showUserDropdown ? "active" : ""}`}
            onClick={toggleUserDropdown}
          >
            <FaUser className="user-icon" />
            <div className="user-details">
              Hello, <span className="user-name">{user.name}</span>!
              <div className="user-role-divisi">
                <span>{user.role}</span> - <span>{user.divisi}</span>
              </div>
            </div>
              <div className={`user-dropdown ${showUserDropdown?'show':''}`}>
                <Link className="dropdown-item" onClick={handleChangePassword}>
                  Change Password
                </Link>
                <div className="dropdown-item" onClick={handleLogout}>
                  Log Out
                </div>
              </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
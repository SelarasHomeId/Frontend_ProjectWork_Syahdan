import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/Sidebar.css";
import { workspaceFind } from "../service/apiService";

// Pastikan path benar
import logo from "../assets/img/selarasBackground.jpg"; 

function Sidebar({ showSidebar, toggleSidebar, onPageChange }) {
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [workspaceList, setWorkspaceList] = useState([]);
  const [showMasterdata, setShowMasterdata] = useState(false);

  const roleId = localStorage.getItem("roleId");
  const shouldShowMasterdata = roleId === "1";

  const toggleSubMenu = (submenuSetter, resetSubmenu) => {
    submenuSetter((prev) => !prev);
    if (resetSubmenu) resetSubmenu(false);
  };

  useEffect(() => {
    const controller = new AbortController(); 
    const fetchWorkspaceData = async () => {
      try {
        const response = await workspaceFind();
        setWorkspaceList(response);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching Workspace data:", error);
        }
      }
    };

    fetchWorkspaceData();

    return () => controller.abort();
  }, []);

  return (
    <div className={`app-container ${showSidebar ? "sidebar-active" : ""}`}>
      <div className={`sidebar-container bg-dark ${showSidebar ? "active" : ""}`}>
        <div className="sidebar text-white p-3">
          
          {/* Logo hanya muncul saat sidebar terbuka */}
          {showSidebar && (
            <div className="sidebar-logo text-center mb-3">
              {/* Tambahkan penanganan error jika gambar tidak ditemukan */}
              {logo ? (
                <img src={logo} alt="Logo" className="img-fluid sidebar-logo-img" />
              ) : (
                <div className="text-white">Logo Not Found</div>
              )}
            </div>
          )}

          {/* Dashboard */}
          <div>
            <h6 className="sidebar-item clickable" onClick={() => onPageChange("dashboard")}>
              <i className="bi bi-house-door-fill"></i> Dashboard
            </h6>
          </div>

          {/* Workspace */}
          <div>
            <h6
              className="sidebar-item clickable"
              onClick={() => toggleSubMenu(setShowWorkspace, setShowMasterdata)}
            >
              <i className="bi bi-folder-fill"></i> Workspace
            </h6>
            {showWorkspace && (
              <ul className="list-unstyled ms-1">
                {workspaceList.map((item) => (
                  <li key={item.id}>
                    <button className="sidebar-link" onClick={() => onPageChange(item.name.toLowerCase())}>
                      <i className="bi bi-check2-square"></i> {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Masterdata (Hanya untuk Admin) */}
          {shouldShowMasterdata && (
            <div>
              <h6
                className="sidebar-item clickable"
                onClick={() => toggleSubMenu(setShowMasterdata, setShowWorkspace)}
              >
                <i className="bi bi-database-fill"></i> Masterdata
              </h6>
              {showMasterdata && (
                <ul className="list-unstyled ms-1">
                  <li>
                    <button className="sidebar-link" onClick={() => onPageChange("users")}>
                      <i className="bi bi-person-lines-fill"></i> Users
                    </button>
                  </li>
                  <li>
                    <button className="sidebar-link" onClick={() => onPageChange("roles")}>
                      <i className="bi bi-person-badge-fill"></i> Roles
                    </button>
                  </li>
                  <li>
                    <button className="sidebar-link" onClick={() => onPageChange("divisions")}>
                      <i className="bi bi-people-fill"></i> Divisions
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Sidebar;

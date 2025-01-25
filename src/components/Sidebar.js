import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/Sidebar.css";
import { workspaceFind } from "../service/apiService";
import { getIconClass } from "../utils/general";

function Sidebar({ showSidebar, toggleSidebar, onPageChange }) {
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [workspaceList, setWorkspaceList] = useState([]);
  const [showMasterdata, setShowMasterdata] = useState(false);

  // Fungsi toggle submenu
  const toggleSubMenu = (submenuSetter, resetSubmenu) => {
    submenuSetter((prev) => !prev);
    // Menutup submenu lainnya ketika salah satu submenu dibuka
    if (resetSubmenu) {
      resetSubmenu();
    }
  };

  const fetchWorkspaceData = async () => {
    try {
      const response = await workspaceFind();
      setWorkspaceList(response);
    } catch (error) {
      console.error("Error fetching Workspace data:", error);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, []);

  return (
    <div className={`app-container ${showSidebar ? "sidebar-active" : ""}`}>
      {/* Sidebar */}
      <div className={`sidebar-container ${showSidebar ? "active" : ""}`}>
        <div className="sidebar bg-dark text-white p-3">
          <h5 className="mb-4 text-center">Menu</h5>

          {/* Dashboard */}
          <button
            className="sidebar-item"
            onClick={() => onPageChange("dashboard")}
          >
            <i className="bi bi-house-door-fill"></i> Dashboard
          </button>

          {/* Workspace */}
          <div>
            <h6
              className="sidebar-item clickable"
              onClick={() =>
                toggleSubMenu(setShowWorkspace, showMasterdata ? setShowMasterdata : null)
              }
            >
              <i className="bi bi-person-fill"></i> Workspace
            </h6>
            {showWorkspace && (
              <ul className="list-unstyled ms-3">
                {workspaceList.map((item) => (
                  <li key={item.id}>
                    <button
                      className="sidebar-link"
                      onClick={() => onPageChange(item.name.toLowerCase())}
                    >
                      <i className={getIconClass(item.name)}></i> {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Masterdata */}
          <div>
            <h6
              className="sidebar-item clickable"
              onClick={() =>
                toggleSubMenu(setShowMasterdata, showWorkspace ? setShowWorkspace : null)
              }
            >
              <i className="bi bi-database"></i> Masterdata
            </h6>
            {showMasterdata && (
              <ul className="list-unstyled ms-3">
                {[ 
                  { name: "User", icon: "bi bi-person", page: "user" },
                  { name: "Role", icon: "bi bi-person-check", page: "role" },
                  { name: "Division", icon: "bi bi-sliders", page: "division" }
                ].map((item) => (
                  <li key={item.page}>
                    <button
                      className="sidebar-link"
                      onClick={() => onPageChange(item.page)}
                    >
                      <i className={item.icon}></i> {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
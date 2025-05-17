import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/Sidebar.css";
import { workspaceFind } from "../service/apiService";
import Cookies from "js-cookie";
import LogoSelarasSidebar from "../assets/img/selarasBackground.jpg"; 

function Sidebar({ showSidebar, onPageChange, thisHasCover }) {
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [workspaceList, setWorkspaceList] = useState([]);
  const [showMasterdata, setShowMasterdata] = useState(false);

  const roleId = Cookies.get("roleId");
  const shouldShowMasterdata = roleId === "1";

  const toggleSubMenu = (submenuSetter, resetSubmenu) => {
    submenuSetter((prev) => !prev);
    if (resetSubmenu) resetSubmenu(false);
  };
  
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

  useEffect(() => {
    fetchWorkspaceData();
  }, []);

  useEffect(() => {
    if (showSidebar) {
        fetchWorkspaceData();
    }
}, [showSidebar]);

  return (
    <div className={`app-container ${showSidebar ? "sidebar-active" : ""}`}>
      <div className={`sidebar-container bg-dark ${showSidebar ? "active" : ""}`}>
        <div className="sidebar text-white p-3">
          
          {/* Logo hanya muncul saat sidebar terbuka */}
          {showSidebar && (
            <div className="sidebar-logo text-center mb-3 clickable" >
              {LogoSelarasSidebar ? (
                <img src={LogoSelarasSidebar} alt="Logo" className="img-fluid sidebar-logo-img cursor-pointer"/>
              ) : (
                <div className="text-white">Logo Not Found</div>
              )}
            </div>
          )}

          {/* Dashboard */}
          <div>
            <h6 className="sidebar-item clickable" onClick={() => {
                onPageChange("dashboard");
                thisHasCover(null);
              }}>
              <i className="bi bi-house-door-fill"></i> Dashboard
            </h6>
          </div>

          {/* Workspace */}
          <div>
            <h6
              className="sidebar-item clickable"
              onClick={() => toggleSubMenu(setShowWorkspace, setShowMasterdata)}
            >
              <span>
                <i className="bi bi-folder-fill"></i> Workspace
              </span>
              <i style={{marginLeft: "59px"}} className={`bi ${showWorkspace ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
            </h6>
            {showWorkspace && (
              <ul
                className={`list-unstyled ms-1 transition-submenu ${showWorkspace ? "d-block" : "d-none"}`}
                style={{
                  maxHeight: showWorkspace ? '500px' : '0',
                  opacity: showWorkspace ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'all 0.4s ease',
                }}
              >
                {workspaceList.map((item) => (
                  <li key={item.id}>
                    <button 
                      className="sidebar-link" 
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',              
                        whiteSpace: 'normal',
                        wordBreak: 'break-word', 
                        textAlign: 'left',
                        width: '100%',
                      }} 
                      onClick={() => {
                        onPageChange(item.name.toLowerCase() + "_" + item.id); 
                        thisHasCover(item.cover);
                      }}
                    >
                      <i className="bi bi-check2-square"></i> <span style={{ flex: 1 }}>{item.name}</span>
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
                <span>
                  <i className="bi bi-database-fill"></i> Masterdata
                </span>
                <i style={{marginLeft: "59px"}} className={`bi ${showMasterdata ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
              </h6>
              {showMasterdata && (
                <ul
                  className={`list-unstyled ms-1 transition-submenu ${showMasterdata ? "d-block" : "d-none"}`}
                  style={{
                    maxHeight: showMasterdata ? '500px' : '0',
                    opacity: showMasterdata ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                  }}
                >
                  <li>
                    <button className="sidebar-link" onClick={() => {
                        onPageChange("project");
                        thisHasCover(null);
                      }}>
                      <i className="bi bi-kanban"></i> Project
                    </button>
                  </li>
                  <li>
                    <button className="sidebar-link" onClick={() => {
                        onPageChange("user")
                        thisHasCover(null);
                      }}>
                      <i className="bi bi-person-lines-fill"></i> User
                    </button>
                  </li>
                  <li>
                    <button className="sidebar-link" onClick={() => {
                        onPageChange("role")
                        thisHasCover(null);
                      }}>
                      <i className="bi bi-person-badge-fill"></i> Role
                    </button>
                  </li>
                  <li>
                    <button className="sidebar-link" onClick={() => {
                        onPageChange("division")
                        thisHasCover(null);
                      }}>
                      <i className="bi bi-people-fill"></i> Division
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

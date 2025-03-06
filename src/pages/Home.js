import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import User from "../components/User.js";
import Role from "../components/Role.js";
import Division from "../components/Division.js";
import Workspace from "../components/Workspace.js";
import Project from "../components/Project.js";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Menghilangkan scrollbar horizontal saat sidebar aktif
  useEffect(() => {
    document.body.style.overflowX = isSidebarActive ? "hidden" : "auto";
  }, [isSidebarActive]);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsSidebarActive(false);
  };

  const pageTitles = {
    dashboard: "Dashboard",
    user: "User Management",
    role: "Role Management",
    division: "Division Management",
    project: "Project Management",
  };

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderPage = () => {
    return (
      <di>
        <h3 
          className={`${
              ["user", "role", "division", "project"].includes(currentPage)
                ? "text-left ms-3"
                : "text-center"
            } text-dark fw-bold display-6 mt-3`} 
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {pageTitles[currentPage] || `${capitalizeWords(currentPage)}`}
        </h3>
        {currentPage === "dashboard" ? (
          <Dashboard />
        ) : currentPage === "user" ? (
          <User />
        ) : currentPage === "role" ? (
          <Role />
        ) : currentPage === "division" ? (
          <Division />
        ) : currentPage === "project" ? (
          <Project />
        ) : (
          <Workspace workspaceName={currentPage} />
        )}
      </di>
    )
  };

  return (
    <div className="vh-100 d-flex flex-column">
      <div 
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000, // Pastikan navbar di atas elemen lain
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} />
      </div>

      <div className="d-flex flex-grow-1" style={{ marginTop: "56px" }}> 
        {/* Sidebar */}
        <div
          className="sidebar bg-dark"
          style={{
            width: isSidebarActive ? "250px" : "0",
            transition: "width 0.3s ease",
            overflow: "hidden",
            position: "fixed",
            left: 0,
            top: 0,
            height: "100vh",
          }}
        >
          <Sidebar showSidebar={isSidebarActive} toggleSidebar={toggleSidebar} onPageChange={handlePageChange} />
        </div>

        {/* Konten full layar jika sidebar nonaktif */}
        <div
          className="content flex-grow-1 p-3"
          style={{
            transition: "margin-left 0.3s ease",
            marginLeft: isSidebarActive ? "250px" : "0",
            width: isSidebarActive ? "calc(100% - 250px)" : "100%",
          }}
        >
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default Home;

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
  const [isSidebarActive, setIsSidebarActive] = useState(true);
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
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "user":
        return <User />;
      case "role":
        return <Role />;
      case "division":
        return <Division />;
      case "project":
        return <Project />;
      default:
        return <Workspace workspaceName={currentPage} />;
    }
  };

  return (
    <div className="vh-100 d-flex flex-column">
      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Container utama: Sidebar + Konten */}
      <div className="d-flex flex-grow-1">
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

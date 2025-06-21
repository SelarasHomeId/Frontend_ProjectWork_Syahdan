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
  const [toDetailTask, setToDetailTask] = useState(null);
  const [cover, setCover] = useState(null);

  useEffect(() => {
    document.body.style.overflowX = isSidebarActive ? "hidden" : "auto";
  }, [isSidebarActive]);

  const toggleNavbar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const showDetailTask = (task) => {
    setCurrentPage(task.workspace.name.toLowerCase() + "_" + task.workspace.id)
    setToDetailTask(task);
    setIsSidebarActive(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsSidebarActive(false);
  };

  const handleHasCover = (cover) => {
    setCover(cover != null ? cover : null);
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
      <div>
        <h3 
          className={`${
              ["user", "role", "division", "project"].includes(currentPage)
                ? "text-left ms-3"
                : "text-center"
            } text-dark fw-bold display-6 mt-3`} 
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {pageTitles[currentPage] || `${capitalizeWords(currentPage.split("_")[0])}`}
        </h3>
        {currentPage === "dashboard" ? (
          <Dashboard showDetailTask={showDetailTask} />
        ) : currentPage === "user" ? (
          <User />
        ) : currentPage === "role" ? (
          <Role />
        ) : currentPage === "division" ? (
          <Division />
        ) : currentPage === "project" ? (
          <Project />
        ) : (
          <Workspace workspaceId={currentPage.split("_")[1]} toDetailTask={toDetailTask} setToDetailTask={setToDetailTask} />
        )}
      </div>
    )
  };

  return (
    <div className="vh-100 d-flex flex-column">
      <div 
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
        }}
      >
        <Navbar showSidebar={isSidebarActive} toggleNavbar={toggleNavbar} showDetailTask={showDetailTask} />
      </div>

      <div className="d-flex flex-grow-1" style={{ marginTop: "56px" }}> 
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
          <Sidebar showSidebar={isSidebarActive} onPageChange={handlePageChange} thisHasCover={handleHasCover} />
        </div>
        <div
          className="content flex-grow-1 p-3"
          style={{
            transition: "margin-left 0.3s ease",
            marginLeft: isSidebarActive ? "250px" : "0",
            width: isSidebarActive ? "calc(100% - 250px)" : "100%",
            backgroundImage: cover ? `url(${cover.view_saved})` : "none",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default Home;

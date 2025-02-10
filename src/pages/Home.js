import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import User from "../components/User.js";
import Role from "../components/Role.js";
import Division from "../components/Division.js";
import Workspace from "../components/Workspace.js";
import Project from "../components/Project.js";

function Home() {
  const [isSidebarActive, setIsSidebarActive] = useState(true); // State untuk mengelola status sidebar
  const [currentPage, setCurrentPage] = useState("dashboard"); // State untuk halaman yang sedang aktif

  // Fungsi untuk toggle status sidebar (tampilkan/sembunyikan)
  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  // Fungsi untuk mengubah halaman saat menu sidebar di klik
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fungsi untuk merender konten halaman sesuai dengan state currentPage
  const renderPage = () => {
    if (currentPage==="dashboard"){
      return <Dashboard />;
    }else if (currentPage==="user"){
      return <User />;
    }else if (currentPage==="role"){
      return <Role />;
    }else if (currentPage==="division"){
      return <Division />;
    }else if (currentPage==="project"){
      return <Project />;
    }else{
      return <Workspace
        workspaceName={currentPage}
      />
    }
  };

  return (
    <div className={`home-page ${isSidebarActive ? "sidebar-active" : ""}`}>
      {/* Navbar: Berfungsi untuk menampilkan bar navigasi di atas */}
      <Navbar toggleSidebar={toggleSidebar} />
      {/* Konten utama: Menampilkan halaman sesuai menu yang dipilih */}
      <div className="content">
          {renderPage()}
        </div>
      <div className="main-content">
        {/* Sidebar: Menu navigasi samping */}
        <Sidebar
          showSidebar={isSidebarActive}
          toggleSidebar={toggleSidebar}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Home;
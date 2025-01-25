import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import Marketing from "../components/workspace/Marketing.js";
import Legal from "../components/workspace/Legal.js";
import Technical from "../components/workspace/Technical.js";
import Accounting from "../components/workspace/Accounting.js";
import User from "../components/masterdata/User.js";
import Role from "../components/masterdata/Role.js";
import Division from "../components/masterdata/Division.js";

// Enum untuk mendefinisikan halaman agar lebih terorganisir dan mudah diubah
const PAGES = Object.freeze({
  DASHBOARD: "dashboard",
  MARKETING: "marketing",
  LEGAL: "legal",
  TECHNICAL: "technical",
  ACCOUNTING: "accounting",
  USER: "user",
  ROLE: "role",
  DIVISION: "division",
});

function Home() {
  const [isSidebarActive, setIsSidebarActive] = useState(true); // State untuk mengelola status sidebar
  const [currentPage, setCurrentPage] = useState(PAGES.DASHBOARD); // State untuk halaman yang sedang aktif

  // Fungsi untuk toggle status sidebar (tampilkan/sembunyikan)
  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  // Fungsi untuk mengubah halaman saat menu sidebar di klik
  const handlePageChange = (page) => {
    console.log("ini menu yang di klik : ", page)
    setCurrentPage(page);
  };

  // Fungsi untuk merender konten halaman sesuai dengan state currentPage
  const renderPage = () => {
    switch (currentPage) {
      case PAGES.DASHBOARD:
        return <Dashboard />;
      case PAGES.MARKETING:
        return <Marketing />;
      case PAGES.LEGAL:
        return <Legal />;
      case PAGES.TECHNICAL:
        return <Technical />;
      case PAGES.ACCOUNTING:
        return <Accounting />;
      case PAGES.USER:
        return <User />;
      case PAGES.ROLE:
        return <Role />;
      case PAGES.DIVISION:
        return <Division />;
      default:
        return (
          <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
            Halaman tidak ditemukan!
          </div>
        );
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
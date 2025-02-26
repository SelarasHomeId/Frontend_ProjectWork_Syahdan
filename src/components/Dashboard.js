import React, { useState } from "react";
import PieChart from "../components/PieChart";
import { FaClipboard } from "react-icons/fa";
import "../styles/Dashboard.css";

function Dashboard() {
  // Data untuk Pie Chart
  const socialMediaData = {
    instagram: 200,
    whatsapp: 180,
    tiktok: 150,
    facebook: 120,
  };

  const contactAffiliateData = {
    contact: 300,
    affiliate: 250,
  };

  // Data jumlah task
  const taskCounts = {
    todo: 10,
    inProgress: 5,
    testing: 3,
  };

  const taskKeyMap = {
    "To Do": "todo",
    "In Progress": "inProgress",
    "Testing": "testing",
  };

  // Data Roles
  const roles = [
    { id: 1, name: "Admin", description: "Manages all aspects of the app" },
    { id: 2, name: "User", description: "Regular user with limited access" },
    { id: 3, name: "Manager", description: "Manages tasks and users" },
    { id: 4, name: "Developer", description: "Works on app development" },
    { id: 5, name: "Designer", description: "Designs UI/UX for the app" },
    { id: 6, name: "Tester", description: "Tests the app for bugs" },
    { id: 7, name: "Support", description: "Provides customer support" },
  ];

  const itemsPerPage = 5;

  // State pagination & pencarian untuk setiap tabel
  const [tableState, setTableState] = useState([
    { currentPage: 1, searchQuery: "" },
    { currentPage: 1, searchQuery: "" },
  ]);

  // Fungsi untuk menangani pencarian & pagination per tabel
  const handleSearchChange = (index, value) => {
    const updatedState = [...tableState];
    updatedState[index].searchQuery = value;
    updatedState[index].currentPage = 1; // Reset ke halaman pertama
    setTableState(updatedState);
  };

  const nextPage = (index) => {
    if (tableState[index].currentPage < Math.ceil(roles.length / itemsPerPage)) {
      const updatedState = [...tableState];
      updatedState[index].currentPage += 1;
      setTableState(updatedState);
    }
  };

  const prevPage = (index) => {
    if (tableState[index].currentPage > 1) {
      const updatedState = [...tableState];
      updatedState[index].currentPage -= 1;
      setTableState(updatedState);
    }
  };

  return (
    <div className="dashboard">
      <div className="charts">
        <div className="chart">
          <h4>Instagram, WA, TikTok, Facebook</h4>
          <PieChart data={socialMediaData} />
        </div>
        <div className="chart">
          <h4>Contact & Affiliate</h4>
          <PieChart data={contactAffiliateData} />
        </div>
      </div>

      {/* Section Task Management */}
      <div className="board-section">
        <h2 className="board-title">Task Management</h2>
        <div className="board-container">
          {["To Do", "In Progress", "Testing"].map((status, index) => (
            <div className="board" key={index}>
              <FaClipboard className="board-icon" />
              <span className="count">{taskCounts[taskKeyMap[status]]}</span>
              <p>{status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dua tabel roles terpisah */}
      {[0, 1].map((tableIndex) => {
        const currentPage = tableState[tableIndex].currentPage;
        const searchQuery = tableState[tableIndex].searchQuery;

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;

        const filteredRoles = roles
          .filter((role) =>
            role.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(indexOfFirstItem, indexOfLastItem);

        return (
          <div className="role-table-container" key={tableIndex}>
            <h3>Role Table {tableIndex + 1}</h3>
            <input
              type="text"
              placeholder="Search by Role Name"
              value={searchQuery}
              onChange={(e) => handleSearchChange(tableIndex, e.target.value)}
              className="search-bar"
            />
            

            <table className="role-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Role Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.length > 0 ? (
                  filteredRoles.map((role, index) => (
                    <tr key={role.id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{role.name}</td>
                      <td>{role.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No roles found</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Tombol pagination untuk tabel ini */}
            <div className="pagination">
              <button onClick={() => prevPage(tableIndex)} disabled={currentPage === 1}>
                Prev
              </button>
              <button
                onClick={() => nextPage(tableIndex)}
                disabled={currentPage === Math.ceil(roles.length / itemsPerPage)}
              >
                Next
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Dashboard;

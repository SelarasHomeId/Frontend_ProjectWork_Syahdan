import React, { useState, useEffect } from "react";
import PieChart from "../components/PieChart";
import { FaClipboard } from "react-icons/fa";
import "../styles/Dashboard.css";
import { getAllCalculateTask, getAllContactAndAffiliate, getAllCountAccess } from "../service/apiService";
import * as XLSX from 'xlsx';

function Dashboard() {
  const [countAccess, setCountAccess] = useState({});
  const [countCalculateTask, setCountCalculateTask] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [affiliateData, setAffiliateData] = useState([]);
  const [tableState, setTableState] = useState([]);

  const socialMediaData = {
    instagram: countAccess.count_instagram,
    whatsapp: countAccess.count_whatsapp,
    tiktok: countAccess.count_tiktok,
    facebook: countAccess.count_facebook,
  };
  
  const contactAffiliateData = {
    contact: countAccess.count_contact,
    affiliate: countAccess.count_affiliate,
  };

  const itemsPerPage = 5;

  const handleSearchChange = (index, value) => {
    setTableState((prev) =>
      prev.map((table, i) =>
        i === index ? { ...table, searchQuery: value, currentPage: 1 } : table
      )
    );
  };

  const changePage = (index, direction) => {
    setTableState((prev) =>
      prev.map((table, i) =>
        i === index
          ? {
              ...table,
              currentPage:
                direction === "next"
                  ? table.currentPage + 1
                  : table.currentPage - 1,
            }
          : table
      )
    );
  };

  const loadData = async () => {
    const [accessRes, taskRes, contactRes, affiliateRes] = await Promise.all([
      getAllCountAccess(),
      getAllCalculateTask(),
      getAllContactAndAffiliate("/crm/contact"),
      getAllContactAndAffiliate("/crm/affiliate"),
    ]);

    if (accessRes.success) setCountAccess(accessRes.data);
    if (taskRes.success) setCountCalculateTask(taskRes.data.data);

    if (contactRes.success) {
      const fullContactRes = await getAllContactAndAffiliate(`/crm/contact?offset=0&limit=${contactRes.data.count}`);
      if (fullContactRes.success) setContactData(fullContactRes.data.data);
    }

    if (affiliateRes.success) {
      const fullAffiliateRes = await getAllContactAndAffiliate(`/crm/affiliate?offset=0&limit=${affiliateRes.data.count}`);
      if (fullAffiliateRes.success) setAffiliateData(fullAffiliateRes.data.data);
    }
  };

  const handleExportData = async (tableIndex) => {
    const table = tableState[tableIndex];

    const fieldMaps = {
      0: {
          no: 'No',
          name: 'Full Name',
          email: 'Email Address',
          phone: 'Phone Number',
          message: 'Message Customer',
          created_at: 'Date Submitted'
      },
      1: {
          no: 'No',
          name: 'Full Name',
          email: 'Email Address',
          phone: 'Phone Number',
          instagram: 'Instagram',
          tiktok: 'TikTok',
          info: 'Info from Affiliator',
          created_at: 'Date Submited'
      }
    };

    const fieldMap = fieldMaps[tableIndex];

    const modifiedContacts = table.data.map((data, index) => {
        const modifiedContact = {
            no: index + 1,
            ...data,
            created_at: new Date(data.created_at).toISOString().split('T')[0]
        };

        const renamedContact = {};
        Object.keys(fieldMap).forEach(key => {
            renamedContact[fieldMap[key]] = modifiedContact[key] || '';
        });

        return renamedContact;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(modifiedContacts, { header: Object.values(fieldMap) });
    XLSX.utils.book_append_sheet(wb, ws, table.name);

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;

    const exportFileName = `Export_${table.name.split(' ').join('_')}_${currentDate}`;

    XLSX.writeFile(wb, `${exportFileName}`.xlsx);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (contactData.length || affiliateData.length) {
      setTableState([
        { currentPage: 1, searchQuery: "", name: "Contact Data", data: contactData },
        { currentPage: 1, searchQuery: "", name: "Affiliate Data", data: affiliateData },
      ]);
    }
  }, [contactData, affiliateData]);

  if (tableState.length < 2) return null;

  return (
    <div className="dashboard">
      <div className="charts">
        <div className="chart">
          <h5>Instagram, WhatsApp, TikTok, Facebook</h5>
          <PieChart data={socialMediaData} />
        </div>
        <div className="chart">
          <h5>Contact & Affiliate</h5>
          <PieChart data={contactAffiliateData} />
        </div>
      </div>

      {countCalculateTask.map((workspaceData, index) => (
        <div className="board-section" key={index}>
          <h2 className="board-title">{workspaceData.workspace}</h2>
          <div className="board-container">
            {workspaceData.board.map((boardItem) => (
              <div className="board" key={boardItem.id || boardItem.name}>
                <div className="board-icon-wrapper">
                  <FaClipboard className="board-icon" />
                  {boardItem.has_new && <span className="new-label">Has New!</span>}
                </div>
                <span className="count">{boardItem.count_task}</span>
                <p>{boardItem.name}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {tableState.map((table, tableIndex) => {
        const { currentPage, searchQuery, name, data } = table;
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;

        const filteredData = data
          .filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.phone.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(indexOfFirstItem, indexOfLastItem);

        return (
          <div className="role-table-container" key={tableIndex}>
            <div className="role-table-header">
              <h3>{name}</h3>
              <button className="export-button" onClick={() => handleExportData(tableIndex)}>
                Export Data
              </button>
            </div>
            <input
              type="text"
              placeholder="Search by Name, Email, or Phone"
              value={searchQuery}
              onChange={(e) => handleSearchChange(tableIndex, e.target.value)}
              className="search-bar"
            />

            {/* Tambahkan div pembungkus dengan overflow-x: auto */}
            <div className="table-wrapper">
              <table className="role-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    {tableIndex !== 0 && (
                      <>
                        <th>Instagram</th>
                        <th>TikTok</th>
                      </>
                    )}
                    <th>{tableIndex === 0 ? "Message" : "Info"}</th>
                    <th>Date Submited</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={item.id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        {tableIndex !== 0 && (
                          <>
                            <td>{item.instagram || "-"}</td>
                            <td>{item.tiktok || "-"}</td>
                          </>
                        )}
                        <td dangerouslySetInnerHTML={{ __html: tableIndex === 0 ? item.message : item.info }} />
                        <td>{new Date(item.created_at).toLocaleDateString("id-ID")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={tableIndex === 0 ? 5 : 7}>No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button onClick={() => changePage(tableIndex, "prev")} disabled={currentPage === 1}>
                Prev
              </button>
              <button onClick={() => changePage(tableIndex, "next")} disabled={currentPage >= Math.ceil(data.length / itemsPerPage)}>
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
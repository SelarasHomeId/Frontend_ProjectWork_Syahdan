import React, { useState, useEffect,useCallback  } from "react";
import PieChart from "../components/PieChart";
import "../styles/Dashboard.css";
import "../styles/Navbar.css";
import { getAllCalculateTask, getAllContactAndAffiliate, getAllCountAccess,searchTask, getTaskById, processDownloadExcel } from "../service/apiService";
import * as XLSX from 'xlsx';
import { formatDate } from "../utils/general";
import Swal from "sweetalert2";
import { debounce } from "lodash";




function Dashboard({showDetailTask}) {
  const [countAccess, setCountAccess] = useState({});
  const [countCalculateTask, setCountCalculateTask] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [affiliateData, setAffiliateData] = useState([]);
  const [tableState, setTableState] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);


 
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


  const loadData = useCallback(async () => {
  const [accessRes, taskRes, contactRes, affiliateRes] = await Promise.all([
    getAllCountAccess(),
    getAllCalculateTask(),
    getAllContactAndAffiliate("/crm/contact?no_paging=yes"),
    getAllContactAndAffiliate("/crm/affiliate?no_paging=yes"),
  ]);


  if (accessRes && accessRes.success) setCountAccess(accessRes.data);
  if (taskRes && taskRes.success) setCountCalculateTask(taskRes.data.data);
  if (contactRes && contactRes.success) setContactData(contactRes.data.data);
  if (affiliateRes && affiliateRes.success) setAffiliateData(affiliateRes.data.data);
}, []);


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


    XLSX.writeFile(wb,`${exportFileName}.xlsx`);
  };


  const fetchSearchResults = async (query) => {
      if (query.length > 0) {
        const response = await searchTask(query);
        setSearchResults(response);
        setShowSearchDropdown(true);
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    };


  const debouncedSearch = debounce(fetchSearchResults, 300);


  useEffect(() => {
      debouncedSearch(searchQuery);
      return () => debouncedSearch.cancel();
    }, [searchQuery, debouncedSearch]);


  useEffect(() => {
    loadData();
  },[loadData] );


  useEffect(() => {
    if (contactData.length || affiliateData.length) {
      setTableState([
        { currentPage: 1, searchQuery: "", name: "Contact Data", data: contactData },
        { currentPage: 1, searchQuery: "", name: "Affiliate Data", data: affiliateData },
      ]);
    }
  }, [contactData, affiliateData]);


  if (tableState.length < 2) return null;
    const handleClickResultTask = async (taskId) => {
      setSearchResults([]);
      setSearchQuery("");
      setShowSearchDropdown(false);
      const responseTask = await getTaskById(taskId);
      if (responseTask.success){
        const task = responseTask.data.data
        if (task === null){
          Swal.fire({
            title: "Task not found",
            text: "Silakan hubungi admin anda!",
            icon: "error",
            confirmButtonText: "OK",
          })
        }else{
          showDetailTask(task)
        }
      }
    };


  return (
    <div className="dashboard">
     
      <div className="container-fluid" style={{ padding: '1rem' }}>
        <div className="row justify-content-center mb-4">
          <div
            className="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-6"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '600px',
              margin: '0 auto',
              padding: '0 1rem'
            }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search task..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                height: '2.5rem',
                width: '90%',
                minHeight: '2rem',
                maxHeight: '3rem',
                marginLeft: 'auto',
                marginRight: 'auto',
                color:'#000000',
                backgroundColor:'#EEEEEE',
                fontWeight:'bold'
              }}
            />
            {showSearchDropdown && searchQuery !== '' && (
              <ul
                className="list-unstyled"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 2000,
                  background: '#fff',
                  border: '2px solid #1564C0',
                  borderRadius: '0.25rem',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {searchResults && searchResults.length > 0 ? (
                  searchResults.map((task, idx) => (
                    <li
                      key={idx}
                      className="dropdown-item"
                      onClick={() => handleClickResultTask(task.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {task.title}
                      <br />
                      <small className="text-muted">
                        {task.description ? 'Has Description' : 'No Description'}
                      </small>
                    </li>
                  ))
                ) : (
                  <li className="dropdown-item">No tasks found</li>
                )}
              </ul>
            )}
          </div>
        </div>


        <div className="row">
          <div className="col">
            <SummaryTask
              summaryData={countCalculateTask}
              formatDate={formatDate}
            />
            </div>
          </div>
      </div>




       <div className="charts">
        <div className="row gap-x-5 justify-content-center">
          <div
            className="col-12 col-sm-10 col-md-8 col-lg-6 mb-4 d-flex flex-column align-items-center"
            style={{
              width: '100%',
              maxWidth: '500px',
              margin: '0 auto'
            }}
          >
            <h2 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Social Media Click
            </h2>
            {/* wrapper tinggi tetap agar PieChart tidak menciut */}
            <div className="w-100" style={{ height: '500px' }}>
              <PieChart data={socialMediaData} height={300} />
            </div>
          </div>


          <div
            className="col-12 col-sm-10 col-md-8 col-lg-6 mb-4 d-flex flex-column align-items-center"
            style={{
              width: '100%',
              maxWidth: '500px',
              margin: '0 auto'
            }}
          >
            <h2 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Contact & Affiliate
            </h2>
            {/* wrapper tinggi tetap agar PieChart tidak menciut */}
            <div className="w-100" style={{ height: '500px' }}>
              <PieChart data={contactAffiliateData} height={300} />
            </div>
          </div>
        </div>
      </div>




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
              <h3 className="fw-bold">{name}</h3>
              <input
                type="text"
                placeholder="Search by Name, Email, or Phone"
                value={searchQuery}
                onChange={(e) => handleSearchChange(tableIndex, e.target.value)}
                className="form-control px-3 py-2 w-75 w-md-65 w-lg-50 border border-dark shadow-sm"
              />
              <button className="export-button" onClick={() => handleExportData(tableIndex)}>
                Export Data
              </button>
            </div>


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


            <div className="pagination d-flex justify-content-center mt-4">
              <div className="me-3">
                <button className="table-button" onClick={() => changePage(tableIndex, "prev")} disabled={currentPage === 1}>
                  Prev
                </button>
              </div>
              <div className="me-3 ">
                <button className="table-button" onClick={() => changePage(tableIndex, "next")} disabled={currentPage >= Math.ceil(data.length / itemsPerPage)}>
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


const SummaryTask = ({ summaryData, formatDate }) => {
  // default ke workspace pertama
  const [activeWorkspace, setActiveWorkspace] = useState(
    summaryData?.[0]?.id ?? null
  );
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [loadingWorkspaceId, setLoadingWorkspaceId] = useState(null);
  const [loadingBoardId, setLoadingBoardId] = useState(null);
  const [selectedBoardId, setSelectedBoardId] = useState(null);


  const handleWorkspaceClick = (workspaceId) => {
    setActiveWorkspace(workspaceId);
  };


  const handleDownloadClickAll = async () => {
    setLoadingDownload(true);
    await processDownloadExcel('/task/export')
    setLoadingDownload(false);
  };


  const handleDownloadClickWorkspace = async (workspaceId) => {
    setLoadingWorkspaceId(workspaceId);
    await processDownloadExcel(`/task/export?workspace_id=${workspaceId}`)
    setLoadingWorkspaceId(null);
  };


  const handleDownloadClickBoard = async (boardId) => {
    setLoadingBoardId(boardId);
    await processDownloadExcel(`/task/export?board_id=${boardId}`)
    setLoadingBoardId(null);
  };


  const boards =
    summaryData.find((ws) => ws.id === activeWorkspace)?.board ?? [];


  return (
    <div
      className="wbs-container container mb-5"
      style={{
        border: '2px solid #ced4da',
        borderRadius: '0.5rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
      }}
    >
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h3 className="fw-bold mb-0">Summary Task</h3>
      <button
        type="button"
        className="btn btn-success btn-sm d-flex align-items-center"
        onClick={handleDownloadClickAll}
      >
        {loadingDownload ? (
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        ) : (
          <i className="bi bi-download me-2"></i>
        )}
        &nbsp;Unduh Data
      </button>
    </div>
   
    {/* tombol workspace */}
    <div
      className="d-flex flex-nowrap mb-4 "
      role="group"
      style={{
        width: '100%',
        overflowX: 'auto',      
        WebkitOverflowScrolling: 'touch',
        padding: '0 0.5rem',
        paddingBottom: '1 rem',
      }}
    >
      {summaryData.map((ws) => {
        const isActive = activeWorkspace === ws.id;
        return (
          <button
            key={ws.id}
            type="button"
            className="btn flex-shrink-0 d-flex align-items-center justify-content-between"
            onClick={() => handleWorkspaceClick(ws.id)}
            style={{
              margin: '0 0.25rem',
              padding: '0.4rem 0.8rem',
              minWidth: '20%',
              maxWidth: '100%',
              minHeight: '2.5rem',
              height: 'auto',
              backgroundColor: isActive ? '#1564C0' : '#F2FAFC',
              color: isActive ? '#FFFFFF' : '#01008A',
              border: `1px solid ${isActive ? '#1564C0' : '#CCCCCC'}`,
              borderRadius: '0.5rem',
              whiteSpace: 'wrap',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <span className="me-2">{ws.workspace}</span>


            {isActive && (
              <div
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // mencegah klik tombol luar
                  handleDownloadClickWorkspace(ws.id);
                }}
                className="btn btn-sm p-0 m-0"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isActive ? '#FFFFFF' : '#1564C0',
                  fontSize: '1rem',
                }}
                title="Unduh Data"
              >
                {loadingWorkspaceId === ws.id ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="bi bi-download"></i>
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>


      {/* board cards — scrollable horizontal */}
      <div
        className="wbs-boards"
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '1rem',
          paddingBottom: '0.5rem',
        }}
      >
        {boards.map((boardItem) => (
          <div
            key={boardItem.id || boardItem.name}
            style={{ minWidth: '200px', flex: '0 0 auto' }}
          >
            <div
              className="card position-relative"
              onClick={() => {
                if (selectedBoardId === boardItem.id) {
                  setSelectedBoardId(null)
                } else {
                  setSelectedBoardId(boardItem.id)
                }
              }}
              style={{
                minHeight: 'auto',
                maxHeight: '120px',
                overflow: 'hidden',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              <div
                className="card-body"
                style={{ padding: '0.5rem', lineHeight: 1.2 }}
              >
                {/* title + badges */}
                <div
                  className="d-flex align-items-center mb-1"
                  style={{ justifyContent: 'flex-end' }}
                >
                  {boardItem.has_new && (
                    <span
                      className="badge"
                      style={{
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        fontSize: '0.75rem',
                        padding: '0.25em 0.5em',
                        marginRight: '0.4rem',
                      }}
                    >
                      Has New!
                    </span>
                  )}
                  <span
                    className="badge"
                    style={{
                      backgroundColor: '#198754',
                      color: '#fff',
                      fontSize: '0.85rem',
                      padding: '0.35em 0.6em',
                    }}
                  >
                    {boardItem.count_task}
                  </span>
                </div>


                {/* 2. Title lebih tebal */}
                <h6
                  className="mb-1"
                  style={{ fontWeight: '700', fontSize: '1rem', margin: 0 }}
                >
                  {boardItem.name}
                </h6>


                {/* tanggal */}
                <p
                  className="card-text"
                  style={{
                    fontSize: '0.75rem',
                    color: '#6c757d',
                    margin: 0,
                  }}
                >
                  {formatDate(boardItem.updated_at)}
                </p>
              </div>


              {/* Tombol Download muncul jika board ini dipilih */}
              {selectedBoardId === boardItem.id && (
                <button
                  type="button"
                  className="btn btn-success d-flex align-items-center"
                  style={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    right: '0.5rem',
                    borderRadius: '1.5rem',
                    fontSize: '0.85rem',
                    padding: '0.3rem 0.75rem',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadClickBoard(boardItem.id);
                  }}
                >
                  {loadingBoardId === boardItem.id ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <i className="bi bi-download me-1"></i>
                  )}
                  &nbsp;Unduh
                </button>
              )}
            </div>
          </div>
        ))}


        {/* fallback */}
        {activeWorkspace && boards.length === 0 && (
          <div style={{ minWidth: '200px', flex: '0 0 auto' }}>
            <p className="text-muted mb-0">No boards available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
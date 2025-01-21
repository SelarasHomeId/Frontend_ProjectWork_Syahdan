import React from "react";

function Accounting() {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Accounting</h1>
      <p className="text-muted">
        Halaman ini berisi informasi terkait divisi Accounting. Divisi ini bertanggung jawab atas pengelolaan keuangan, pelaporan, dan pengawasan anggaran perusahaan.
      </p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Jabatan</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>Manager</td>
            <td>john.doe@company.com</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jane Smith</td>
            <td>Staff</td>
            <td>jane.smith@company.com</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Accounting;

import React from "react";

function Legal() {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Legal</h1>
      <p className="text-muted">
        Halaman ini berisi informasi terkait divisi Legal. Divisi ini bertanggung jawab atas pengelolaan dokumen hukum, kontrak, dan perlindungan hak perusahaan.
      </p>
      <div className="card">
        <div className="card-header bg-primary text-white">Legal Updates</div>
        <div className="card-body">
          <ul>
            <li>Pembaruan regulasi peraturan pajak - Januari 2025</li>
            <li>Kontrak kerjasama dengan mitra baru - Februari 2025</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Legal;

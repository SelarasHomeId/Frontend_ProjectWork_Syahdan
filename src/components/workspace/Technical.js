import React from "react";

function Technical() {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Technical</h1>
      <p className="text-muted">
        Halaman ini berisi informasi terkait divisi Technical. Divisi ini bertanggung jawab atas pengembangan teknologi, dukungan teknis, dan inovasi produk.
      </p>
      <div className="list-group">
        <div className="list-group-item">
          <h5>Proyek Saat Ini</h5>
          <p>Pengembangan sistem e-commerce untuk klien A</p>
        </div>
        <div className="list-group-item">
          <h5>Dukungan Teknis</h5>
          <p>Menyelesaikan 25 tiket bug dalam bulan ini</p>
        </div>
      </div>
    </div>
  );
}

export default Technical;

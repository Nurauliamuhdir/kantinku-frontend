<?php session_start(); ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Penjualan & Omzet UMKM - KantinKu</title>
    <!-- Bootstrap 5 CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Custom Style System -->
    <link href="../assets/css/style.css" rel="stylesheet">
</head>
<body class="bg-light">

<!-- Header Navbar Admin -->
<header class="app-top-nav sticky-top bg-white border-bottom py-2 shadow-sm">
    <div class="container">
        <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
                <a href="../../index.php" class="text-decoration-none d-flex align-items-center me-3">
                    <span class="fs-4 me-2" style="color: var(--color-food-primary);">📊</span>
                    <div>
                        <h5 class="fw-bold text-dark mb-0 leading-none">KantinKu</h5>
                        <small class="text-muted d-block" style="font-size: 0.72rem;">REKAP PENJUALAN & LAPORAN</small>
                    </div>
                </a>
            </div>

            <div class="d-flex align-items-center gap-2">
                <a href="index.php" class="btn btn-food-outline btn-sm">
                    <i class="bi bi-box-seam me-1"></i> Produk & Kategori
                </a>
                <a href="laporan.php" class="btn btn-food-primary btn-sm">
                    <i class="bi bi-file-earmark-bar-graph me-1"></i> Laporan Omzet
                </a>

                <button onclick="handleLogout()" class="btn btn-outline-danger btn-sm ms-2" title="Keluar">
                    <i class="bi bi-box-arrow-right"></i> Logout
                </button>
            </div>
        </div>
    </div>
</header>

<main class="container py-4">

    <!-- Omzet Card Highlight -->
    <div class="row g-3 mb-4">
        <div class="col-md-6">
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-primary text-white">
                <small class="text-white-50 fw-semibold">TOTAL PENDAPATAN (OMZET LUNAS)</small>
                <div class="fs-1 fw-bold mt-1" id="total-omzet-display">Rp 0</div>
                <small class="mt-2 text-white-50"><i class="bi bi-shield-check me-1"></i> Diperhitungkan otomatis dari transaksi lunas & selesai</small>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <small class="text-muted fw-semibold">VOLUME TRANSAKSI LUNAS</small>
                <div class="fs-1 fw-bold text-dark mt-1" id="total-pesanan-display">0 Transaksi</div>
                <small class="mt-2 text-success"><i class="bi bi-graph-up-arrow me-1"></i> Rekapitulasi penjualan mitra kantin sekolah</small>
            </div>
        </div>
    </div>

    <!-- Table Header & Filter -->
    <div class="card border-0 shadow-sm rounded-4 p-4">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
                <h4 class="fw-bold text-dark mb-1">Rincian Laporan Transaksi Penjualan</h4>
                <p class="text-muted small mb-0">Riwayat detail pesanan makanan, status pembayaran, dan nominal penjualan.</p>
            </div>

            <button onclick="window.print()" class="btn btn-outline-dark btn-sm rounded-pill px-3">
                <i class="bi bi-printer me-1"></i> Cetak Laporan
            </button>
        </div>

        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light small">
                    <tr>
                        <th style="width: 40px;">#</th>
                        <th>Kode Pesanan</th>
                        <th>Waktu Transaksi</th>
                        <th>Nama Pemesan</th>
                        <th>Rincian Item</th>
                        <th>Total Harga</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="laporanTbody">
                    <!-- Populated dynamically -->
                </tbody>
            </table>
        </div>
    </div>

</main>

<!-- Bootstrap 5 JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<script src="../assets/js/data.js"></script>
<script src="../assets/js/api.js"></script>
<script src="../assets/js/app.js"></script>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        initAdminLaporan();
    });
</script>
</body>
</html>

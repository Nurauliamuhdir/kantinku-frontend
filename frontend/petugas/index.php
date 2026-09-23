<?php session_start(); ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal Petugas Dapur & Kasir - KantinKu</title>
    <!-- Bootstrap 5 CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Custom Style System -->
    <link href="../assets/css/style.css" rel="stylesheet">
</head>
<body class="bg-light">

<!-- Header Navbar Petugas -->
<header class="app-top-nav sticky-top bg-white border-bottom py-2 shadow-sm">
    <div class="container">
        <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
                <a href="../../index.php" class="text-decoration-none d-flex align-items-center me-3">
                    <span class="fs-4 me-2" style="color: var(--color-food-primary);">🍳</span>
                    <div>
                        <h5 class="fw-bold text-dark mb-0 leading-none">KantinKu</h5>
                        <small class="text-muted d-block" style="font-size: 0.72rem;">PETUGAS DAPUR & KASIR</small>
                    </div>
                </a>
            </div>

            <div class="d-flex align-items-center gap-2">
                <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
                    <i class="bi bi-circle-fill fs-6 me-1 text-success align-middle"></i> Dapur Aktif
                </span>

                <button onclick="handleLogout()" class="btn btn-food-outline btn-sm ms-2" title="Keluar">
                    <i class="bi bi-box-arrow-right me-1"></i> Logout
                </button>
            </div>
        </div>
    </div>
</header>

<main class="container py-4">

    <!-- Overview Stats Counter Cards -->
    <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
            <div class="card border-0 shadow-sm rounded-4 p-3 border-start border-4 border-warning">
                <small class="text-muted fw-semibold">Menunggu Antrean</small>
                <div class="fs-2 fw-bold text-dark mt-1" id="count-wait">0</div>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card border-0 shadow-sm rounded-4 p-3 border-start border-4 border-info">
                <small class="text-muted fw-semibold">Sedang Diproses</small>
                <div class="fs-2 fw-bold text-dark mt-1" id="count-process">0</div>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card border-0 shadow-sm rounded-4 p-3 border-start border-4 border-primary">
                <small class="text-muted fw-semibold">Siap Diambil</small>
                <div class="fs-2 fw-bold text-dark mt-1" id="count-ready">0</div>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card border-0 shadow-sm rounded-4 p-3 border-start border-4 border-success">
                <small class="text-muted fw-semibold">Selesai Hari Ini</small>
                <div class="fs-2 fw-bold text-dark mt-1" id="count-done">0</div>
            </div>
        </div>
    </div>

    <!-- Antrean Pesanan Header -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
            <h4 class="fw-bold mb-1 text-dark">Daftar Antrean Pesanan Masuk</h4>
            <p class="text-muted small mb-0">Kelola pemrosesan pesanan makanan siswa dari dapur hingga siap diambil.</p>
        </div>

        <button onclick="initPetugasPortal()" class="btn btn-outline-primary btn-sm rounded-pill px-3">
            <i class="bi bi-arrow-clockwise me-1"></i> Refresh Data
        </button>
    </div>

    <!-- Orders List Container -->
    <div id="petugasOrdersList" style="max-width: 900px;" class="mx-auto">
        <!-- Populated dynamically -->
    </div>

</main>

<!-- Bootstrap 5 JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<script src="../assets/js/data.js"></script>
<script src="../assets/js/api.js"></script>
<script src="../assets/js/app.js"></script>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        initPetugasPortal();
    });
</script>
</body>
</html>

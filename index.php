<?php session_start(); ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KantinKu UMKM - Pre-Order Makanan Kantin Sekolah</title>
    
    <!-- Bootstrap 5 CSS & Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    
    <!-- Custom Style Sheet -->
    <link href="frontend/assets/css/style.css" rel="stylesheet">

    <style>
        .hero-natural {
            background-color: #ffffff;
            border-bottom: 1px solid #e2e8f0;
            padding: 70px 0 50px 0;
        }

        .badge-trust-green {
            background: #f0fdf4;
            color: #16a34a;
            border: 1px solid #bbf7d0;
            padding: 6px 14px;
            border-radius: 50px;
            font-size: 0.85rem;
            font-weight: 700;
        }

        .badge-trust-amber {
            background: #fffbeb;
            color: #d97706;
            border: 1px solid #fef3c7;
            padding: 6px 14px;
            border-radius: 50px;
            font-size: 0.85rem;
            font-weight: 700;
        }

        .search-pill-container {
            background: #ffffff;
            border-radius: 60px;
            padding: 8px 12px 8px 24px;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
            border: 1.5px solid #e2e8f0;
        }

        .stat-natural-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
        }

        .stat-natural-number {
            font-size: 1.85rem;
            font-weight: 800;
            color: #0f172a;
        }
    </style>
</head>
<body>

    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg bg-white sticky-top border-bottom py-2">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center gap-2 text-decoration-none" href="index.php">
                <span class="fs-4" style="color: var(--color-primary);">🍱</span>
                <span class="fw-bold fs-4 text-dark mb-0">KantinKu</span>
                <span class="badge bg-success-subtle text-success border border-success-subtle fs-6 px-2 py-1 rounded-pill">UMKM</span>
            </a>
            
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navContent">
                <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link fw-semibold active" href="#katalog"><i class="bi bi-grid me-1"></i> Katalog Menu</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fw-semibold" href="#keunggulan"><i class="bi bi-shield-check me-1"></i> Keunggulan</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fw-semibold" href="#kontak"><i class="bi bi-telephone me-1"></i> Kontak Kantin</a>
                    </li>
                </ul>

                <div class="d-flex align-items-center gap-2" id="navbar-user-container">
                    <!-- Dynamic Auth Header rendered by JS -->
                </div>
            </div>
        </div>
    </nav>

    <!-- HERO SECTION -->
    <section class="hero-natural text-center">
        <div class="container">
            <div class="d-flex flex-wrap justify-content-center gap-2 mb-3">
                <span class="badge-trust-green"><i class="bi bi-shield-check me-1"></i> 100% Halal & Higienis</span>
                <span class="badge-trust-green"><i class="bi bi-fire me-1"></i> Dapur UMKM Lokal</span>
                <span class="badge-trust-amber"><i class="bi bi-lightning-charge-fill me-1"></i> Pre-Order Bebas Antre</span>
            </div>

            <h1 class="fw-bold mb-3 text-dark" style="font-size: 2.5rem; letter-spacing: -0.02em;">
                Kantin & Katering UMKM Sekolah<br>
                <span style="color: var(--color-primary);">Makanan Lezat, Fresh & Bebas Antre</span>
            </h1>
            <p class="text-muted mx-auto mb-4" style="max-width: 620px;">
                Pesan menu istirahat favoritmu sebelum bel berbunyi. Dibuat langsung oleh mitra UMKM dapur sekolah setiap pagi dengan bahan pilihan.
            </p>

            <!-- Search Field -->
            <div class="row justify-content-center mb-4">
                <div class="col-lg-7">
                    <div class="search-pill-container d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center flex-grow-1">
                            <i class="bi bi-search text-muted fs-5 me-3"></i>
                            <input type="text" id="searchInput" class="form-control border-0 shadow-none p-0" placeholder="Cari menu favorit (Nasi Goreng, Es Teh, Ayam Geprek...)" onkeyup="filterLandingSearch()">
                        </div>
                        <button class="btn btn-food-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style="width: 42px; height: 42px;">
                            <i class="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Highlights / Stats -->
            <div class="row g-3 justify-content-center">
                <div class="col-4 col-md-3">
                    <div class="stat-natural-card">
                        <div class="stat-natural-number">500+</div>
                        <small class="text-muted fw-semibold">Porsi Terjual / Hari</small>
                    </div>
                </div>
                <div class="col-4 col-md-3">
                    <div class="stat-natural-card">
                        <div class="stat-natural-number" id="stat-total-varian">4+</div>
                        <small class="text-muted fw-semibold">Varian Menu Makanan</small>
                    </div>
                </div>
                <div class="col-4 col-md-3">
                    <div class="stat-natural-card">
                        <div class="stat-natural-number" style="color: var(--color-amber);">4.9 <i class="bi bi-star-fill fs-5"></i></div>
                        <small class="text-muted fw-semibold">Rating Siswa & Guru</small>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- KATALOG PRODUK -->
    <section class="py-5" id="katalog">
        <div class="container">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h3 class="fw-bold mb-1 text-dark">Menu Sajian Hari Ini</h3>
                    <p class="text-muted mb-0">Pilih menu favoritmu dan ambil langsung saat jam istirahat tiba.</p>
                </div>

                <!-- Kategori Buttons -->
                <div class="d-flex gap-2 overflow-auto pb-2" id="categoryFilters">
                    <!-- Populated dynamically by JS -->
                </div>
            </div>

            <!-- Grid Menu Products -->
            <div class="row g-4" id="menuGrid">
                <!-- Populated dynamically by JS -->
            </div>
        </div>
    </section>

    <!-- KEUNGGULAN SECTION -->
    <section class="py-5 bg-light border-top border-bottom" id="keunggulan">
        <div class="container">
            <div class="text-center mb-5">
                <h3 class="fw-bold text-dark mb-2">Mengapa Memilih KantinKu?</h3>
                <p class="text-muted mx-auto" style="max-width: 550px;">Ekosistem pemesanan makanan sekolah modern yang memberdayakan UMKM lokal dan memudahkan seluruh warga sekolah.</p>
            </div>

            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card h-100 border-0 p-4 rounded-4 shadow-sm text-center">
                        <div class="fs-1 text-primary mb-3">⚡</div>
                        <h5 class="fw-bold text-dark mb-2">Tanpa Antrean Jam Istirahat</h5>
                        <p class="text-muted small mb-0">Pesan dari kelas pada jam pelajaran, makanan siap diambil saat bel istirahat berbunyi.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100 border-0 p-4 rounded-4 shadow-sm text-center">
                        <div class="fs-1 text-success mb-3">🥗</div>
                        <h5 class="fw-bold text-dark mb-2">Higienis & Bahan Fresh</h5>
                        <p class="text-muted small mb-0">Dibuat langsung setiap pagi oleh dapur UMKM terverifikasi dengan standar kebersihan terjaga.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100 border-0 p-4 rounded-4 shadow-sm text-center">
                        <div class="fs-1 text-warning mb-3">💳</div>
                        <h5 class="fw-bold text-dark mb-2">Pembayaran Serba Praktis</h5>
                        <p class="text-muted small mb-0">Dukung opsi pembayaran QRIS cashless maupun pembayaran tunai saat pengambilan.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-white py-4 border-top text-center" id="kontak">
        <div class="container">
            <p class="text-muted small mb-1">&copy; 2026 KantinKu UMKM - Sistem Pre-Order Makanan Kantin Sekolah</p>
            <small class="text-muted">Dikembangkan dengan ❤️ untuk Ekosistem Pendidikan & UMKM Lokal</small>
        </div>
    </footer>

    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Client-Side App Logic -->
    <script src="frontend/assets/js/data.js"></script>
    <script src="frontend/assets/js/api.js"></script>
    <script src="frontend/assets/js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            initLandingPage();
        });
    </script>
</body>
</html>

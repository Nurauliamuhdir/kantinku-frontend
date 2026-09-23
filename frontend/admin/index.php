<?php session_start(); ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal Admin UMKM - KantinKu</title>
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
                    <span class="fs-4 me-2" style="color: var(--color-food-primary);">🔑</span>
                    <div>
                        <h5 class="fw-bold text-dark mb-0 leading-none">KantinKu</h5>
                        <small class="text-muted d-block" style="font-size: 0.72rem;">ADMINISTRATOR UMKM</small>
                    </div>
                </a>
            </div>

            <div class="d-flex align-items-center gap-2">
                <a href="index.php" class="btn btn-food-primary btn-sm">
                    <i class="bi bi-box-seam me-1"></i> Produk & Kategori
                </a>
                <a href="laporan.php" class="btn btn-food-outline btn-sm">
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

    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
            <h3 class="fw-bold text-dark mb-1">Manajemen Katalog Produk & Kategori</h3>
            <p class="text-muted small mb-0">Kelola menu makanan, stok porsi harian, dan kategori sajian UMKM.</p>
        </div>

        <button class="btn btn-food-primary rounded-3" data-bs-toggle="modal" data-bs-target="#productModal" onclick="resetProductModalForm()">
            <i class="bi bi-plus-lg me-1"></i> Tambah Produk Baru
        </button>
    </div>

    <div class="row g-4 mb-4">
        <!-- Sidebar Kelola Kategori -->
        <div class="col-lg-4">
            <div class="card border-0 shadow-sm rounded-4 p-4">
                <h5 class="fw-bold text-dark mb-3"><i class="bi bi-tags text-primary me-2"></i>Kategori Menu</h5>
                
                <form onsubmit="handleSaveAdminCategory(event)" class="mb-3">
                    <div class="input-group">
                        <input type="text" id="new_category_name" class="form-control" placeholder="Nama kategori baru..." required>
                        <button type="submit" class="btn btn-primary"><i class="bi bi-plus"></i></button>
                    </div>
                </form>

                <ul class="list-group list-group-flush rounded-3 border-top" id="adminCategoryList">
                    <!-- Populated dynamically -->
                </ul>
            </div>
        </div>

        <!-- Tabel Kelola Produk -->
        <div class="col-lg-8">
            <div class="card border-0 shadow-sm rounded-4 p-4">
                <h5 class="fw-bold text-dark mb-3"><i class="bi bi-grid-3x3-gap text-success me-2"></i>Daftar Produk Makanan</h5>

                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light small">
                            <tr>
                                <th style="width: 40px;">#</th>
                                <th>Produk</th>
                                <th>Kategori</th>
                                <th>Harga</th>
                                <th>Stok</th>
                                <th style="width: 100px;">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="adminProductsTbody">
                            <!-- Populated dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</main>

<!-- MODAL TAMBAH / EDIT PRODUK -->
<div class="modal fade" id="productModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4">
            <div class="modal-header border-bottom py-3">
                <h5 class="modal-title fw-bold text-dark" id="productModalLabel">Tambah Produk Makanan Baru</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form onsubmit="handleSaveAdminProduct(event)">
                <div class="modal-body p-4">
                    <input type="hidden" id="prod_id">

                    <div class="mb-3">
                        <label for="prod_category_id" class="form-label fw-semibold">Kategori Menu</label>
                        <select id="prod_category_id" class="form-select" required>
                            <!-- Populated dynamically -->
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="prod_nama" class="form-label fw-semibold">Nama Produk</label>
                        <input type="text" id="prod_nama" class="form-control" placeholder="Contoh: Nasi Ayam Bakar" required>
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-6">
                            <label for="prod_harga" class="form-label fw-semibold">Harga (Rp)</label>
                            <input type="number" id="prod_harga" class="form-control" placeholder="15000" required min="500">
                        </div>
                        <div class="col-6">
                            <label for="prod_stok" class="form-label fw-semibold">Stok Porsi</label>
                            <input type="number" id="prod_stok" class="form-control" placeholder="20" required min="0">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="prod_deskripsi" class="form-label fw-semibold">Deskripsi Sajian</label>
                        <textarea id="prod_deskripsi" class="form-control" rows="2" placeholder="Penjelasan singkat menu..."></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="prod_foto" class="form-label fw-semibold">URL Foto Sampul Produk</label>
                        <input type="url" id="prod_foto" class="form-control" placeholder="https://images.unsplash.com/...">
                        <small class="text-muted" style="font-size: 0.75rem;">Kosongkan jika ingin menggunakan gambar default kantin.</small>
                    </div>
                </div>
                <div class="modal-footer border-top bg-light p-3">
                    <button type="button" class="btn btn-outline-secondary rounded-3" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-primary rounded-3 px-4 fw-bold">Simpan Produk</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Bootstrap 5 JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<script src="../assets/js/data.js"></script>
<script src="../assets/js/api.js"></script>
<script src="../assets/js/app.js"></script>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        initAdminPortal();
    });
</script>
</body>
</html>

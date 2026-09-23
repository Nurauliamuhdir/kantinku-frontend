<?php session_start(); ?>
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - KantinKu</title>
    <!-- Bootstrap 5 CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="../assets/css/style.css" rel="stylesheet">
</head>

<body class="auth-wrapper">

    <div class="container py-4">
        <div class="row justify-content-center">
            <div class="col-12 col-sm-10 col-md-8 col-lg-5">
                <div class="card auth-card p-4 p-md-5">
                    <div class="text-center mb-4">
                        <div class="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3" style="width: 70px; height: 70px;">
                            <i class="bi bi-shop fs-1"></i>
                        </div>
                        <h3 class="fw-bold text-dark">KantinKu</h3>
                        <p class="text-muted small">Sistem Pemesanan & E-Commerce Kantin Sekolah</p>
                    </div>

                    <div id="alertNotice" class="alert alert-warning alert-dismissible fade show d-none" role="alert">
                        <i class="bi bi-info-circle-fill me-2"></i><span id="noticeText"></span>
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>

                    <div id="alertError" class="alert alert-danger alert-dismissible fade show d-none" role="alert">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i><span id="errorText"></span>
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>

                    <!-- Quick Role Fill Pills for Evaluation -->
                    <div class="mb-4 text-center">
                        <small class="text-muted d-block mb-2 fw-semibold">Quick Login Demonstrasi Role:</small>
                        <div class="d-flex justify-content-center gap-2" role="group">
                            <button type="button" class="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold" onclick="fillQuickLogin('siswa', 'password123')">🧑 Siswa</button>
                            <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold" onclick="fillQuickLogin('petugas', 'password123')">🧑‍🍳 Petugas</button>
                            <button type="button" class="btn btn-sm btn-outline-warning text-dark rounded-pill px-3 fw-bold" onclick="fillQuickLogin('admin', 'password123')">🔑 Admin</button>
                        </div>
                    </div>

                    <form id="loginForm" onsubmit="handleLoginSubmit(event)">
                        <div class="mb-3">
                            <label for="username" class="form-label fw-semibold">Username</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light"><i class="bi bi-person"></i></span>
                                <input type="text" class="form-control" id="username" placeholder="Masukkan username" required autofocus>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="password" class="form-label fw-semibold">Password</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light"><i class="bi bi-lock"></i></span>
                                <input type="password" class="form-control" id="password" placeholder="Masukkan password" required>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary w-100 py-2 fw-bold rounded-3 mb-3">
                            <i class="bi bi-box-arrow-in-right me-2"></i>Masuk Aplikasi
                        </button>
                    </form>

                    <div class="text-center pt-2">
                        <p class="small text-muted mb-3">Belum punya akun siswa? <a href="register.php" class="fw-bold text-decoration-none text-success">Daftar Akun Baru</a></p>
                    </div>

                    <div class="mt-3 pt-3 border-top text-center">
                        <a href="../../index.php" class="small text-secondary"><i class="bi bi-arrow-left me-1"></i>Kembali ke Beranda Utama</a>
                    </div>
                </div>

                <div class="text-center mt-3 text-white-50 small">
                    &copy; 2026 KantinKu - School Canteen Ecosystem
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap 5 JS Bundle CDN -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <script src="../assets/js/data.js"></script>
    <script src="../assets/js/api.js"></script>
    <script src="../assets/js/app.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', async function() {
            const params = new URLSearchParams(window.location.search);
            if (params.get('notice') === 'login_required') {
                document.getElementById('alertNotice').classList.remove('d-none');
                document.getElementById('noticeText').innerText = 'Silakan login terlebih dahulu untuk mengakses portal.';
            }

            // Auto redirect if already logged in
            const currentUser = await KantinAPI.getCurrentUser();
            if (currentUser) {
                redirectUserByRole(currentUser.role);
            }
        });

        function fillQuickLogin(user, pass) {
            document.getElementById('username').value = user;
            document.getElementById('password').value = pass;
        }

        async function handleLoginSubmit(e) {
            e.preventDefault();
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;

            const res = await KantinAPI.login(u, p);
            if (res.success) {
                redirectUserByRole(res.user.role);
            } else {
                document.getElementById('alertError').classList.remove('d-none');
                document.getElementById('errorText').innerText = res.message;
            }
        }

        function redirectUserByRole(role) {
            const params = new URLSearchParams(window.location.search);
            const redirectParam = params.get('redirect');
            if (redirectParam) {
                window.location.href = decodeURIComponent(redirectParam);
                return;
            }

            if (role === 'siswa') window.location.href = '../siswa/index.php';
            else if (role === 'petugas') window.location.href = '../petugas/index.php';
            else if (role === 'admin') window.location.href = '../admin/index.php';
            else window.location.href = '../../index.php';
        }
    </script>
</body>

</html>
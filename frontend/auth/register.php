<?php session_start(); ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar Akun Siswa - KantinKu</title>
    <!-- Bootstrap 5 CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="../assets/css/style.css" rel="stylesheet">
</head>
<body class="auth-wrapper py-4">

<div class="container">
    <div class="row justify-content-center">
        <div class="col-12 col-sm-10 col-md-8 col-lg-5">
            <div class="card auth-card p-4 p-md-5">
                <div class="text-center mb-4">
                    <div class="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle mb-3" style="width: 65px; height: 65px;">
                        <i class="bi bi-person-plus-fill fs-2"></i>
                    </div>
                    <h3 class="fw-bold text-dark">Daftar Akun Siswa</h3>
                    <p class="text-muted small">Buat akun untuk mulai memesan makanan di KantinKu</p>
                </div>

                <div id="alertError" class="alert alert-danger alert-dismissible fade show d-none" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i><span id="errorText"></span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>

                <form id="registerForm" onsubmit="handleRegisterSubmit(event)">
                    <div class="mb-3">
                        <label for="nama_lengkap" class="form-label fw-semibold">Nama Lengkap & Kelas</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light"><i class="bi bi-card-heading"></i></span>
                            <input type="text" class="form-control" id="nama_lengkap" placeholder="Contoh: Fulana bin Fulan (XI RPL 1)" required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="no_hp" class="form-label fw-semibold">Nomor WhatsApp / HP</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light"><i class="bi bi-whatsapp"></i></span>
                            <input type="tel" class="form-control" id="no_hp" placeholder="Contoh: 08123456789" required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="username" class="form-label fw-semibold">Username</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light"><i class="bi bi-person"></i></span>
                            <input type="text" class="form-control" id="username" placeholder="Buat username unik" required>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label for="password" class="form-label fw-semibold">Password</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light"><i class="bi bi-lock"></i></span>
                            <input type="password" class="form-control" id="password" placeholder="Buat password aman" required>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-success w-100 py-2 fw-bold rounded-3 mb-3">
                        <i class="bi bi-check-circle me-2"></i>Daftar Sekarang
                    </button>
                </form>

                <div class="text-center pt-3 border-top">
                    <p class="small text-muted mb-0">Sudah punya akun? <a href="login.php" class="fw-bold text-decoration-none text-primary">Masuk di sini</a></p>
                    <a href="../../index.php" class="small text-secondary d-inline-block mt-2"><i class="bi bi-arrow-left me-1"></i>Kembali ke Beranda Utama</a>
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
    async function handleRegisterSubmit(e) {
        e.preventDefault();
        const nama = document.getElementById('nama_lengkap').value;
        const noHp = document.getElementById('no_hp').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const res = await KantinAPI.register(username, password, nama, noHp);
        if (res.success) {
            alert('Pendaftaran akun berhasil! Silakan login.');
            window.location.href = 'login.php';
        } else {
            document.getElementById('alertError').classList.remove('d-none');
            document.getElementById('errorText').innerText = res.message;
        }
    }
</script>
</body>
</html>

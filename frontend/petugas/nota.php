<?php session_start(); ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Struk Kasir Petugas - KantinKu</title>
    <!-- Bootstrap 5 CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="../assets/css/style.css" rel="stylesheet">
    <style>
        body { background-color: #f8fafc; font-family: monospace, monospace; }
        .thermal-receipt {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            max-width: 400px;
            margin: 30px auto;
            padding: 24px;
        }
        @media print {
            .no-print { display: none !important; }
            body { background: white; }
            .thermal-receipt { border: none; box-shadow: none; margin: 0; width: 100%; }
        }
    </style>
</head>
<body>

<div class="container">
    <div class="thermal-receipt">
        <div class="text-center mb-3">
            <h5 class="fw-bold mb-0 text-dark">KANTINKU DAPUR</h5>
            <small class="d-block text-muted">Muka Struk Kasir UKK</small>
            <div class="mt-2 fw-bold text-dark nota-kode">#ORD-000</div>
        </div>

        <hr style="border-top: 1px dashed #000;">

        <div class="small mb-3">
            <div class="d-flex justify-content-between">
                <span>Tanggal:</span>
                <span class="nota-tanggal">-</span>
            </div>
            <div class="d-flex justify-content-between">
                <span>Pemesan:</span>
                <strong class="nota-pemesan">-</strong>
            </div>
            <div class="d-flex justify-content-between">
                <span>Metode:</span>
                <span class="nota-metode">-</span>
            </div>
        </div>

        <hr style="border-top: 1px dashed #000;">

        <table class="table table-borderless table-sm small mb-3">
            <thead>
                <tr class="border-bottom">
                    <th>Item</th>
                    <th class="text-center">Qty</th>
                    <th class="text-end">Subtotal</th>
                </tr>
            </thead>
            <tbody id="notaItemsTbody">
                <!-- Items populated dynamically -->
            </tbody>
        </table>

        <hr style="border-top: 1px dashed #000;">

        <div class="d-flex justify-content-between fw-bold fs-6 mb-3">
            <span>TOTAL:</span>
            <span class="nota-total">Rp 0</span>
        </div>

        <div class="text-center small text-muted mb-4">
            *** Terima Kasih ***<br>
            Selamat Menikmati Hidangan Dapur KantinKu
        </div>

        <div class="text-center no-print border-top pt-3">
            <button onclick="window.print()" class="btn btn-dark btn-sm rounded-pill px-4 me-2">
                <i class="bi bi-printer me-1"></i> Cetak Struk
            </button>
            <a href="index.php" class="btn btn-outline-secondary btn-sm rounded-pill">
                Kembali
            </a>
        </div>
    </div>
</div>

<script src="../assets/js/data.js"></script>
<script src="../assets/js/api.js"></script>
<script src="../assets/js/app.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        initNotaPage();
    });
</script>
</body>
</html>

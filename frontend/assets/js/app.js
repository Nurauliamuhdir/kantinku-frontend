/**
 * KantinKu Main Client-side Application Controller (Pure Static HTML/JS)
 * Manages UI rendering, reactive DOM updates, authentication guards, and page actions.
 */

// Helper utility functions
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatDate(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusBadge(status) {
    switch (status) {
        case 'menunggu':
            return '<span class="badge bg-warning text-dark"><i class="bi bi-hourglass-split me-1"></i>Menunggu</span>';
        case 'diproses':
            return '<span class="badge bg-info text-dark"><i class="bi bi-fire me-1"></i>Diproses Dapur</span>';
        case 'siap':
            return '<span class="badge bg-primary"><i class="bi bi-bell-fill me-1"></i>Siap Diambil</span>';
        case 'selesai':
            return '<span class="badge bg-success"><i class="bi bi-check-circle-fill me-1"></i>Selesai</span>';
        case 'dibatalkan':
            return '<span class="badge bg-danger"><i class="bi bi-x-circle-fill me-1"></i>Dibatalkan</span>';
        default:
            return `<span class="badge bg-secondary">${escapeHtml(status)}</span>`;
    }
}

function getPaymentBadge(status) {
    if (status === 'lunas') {
        return '<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1"><i class="bi bi-check2-circle me-1"></i>Lunas</span>';
    }
    return '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1"><i class="bi bi-clock me-1"></i>Belum Bayar</span>';
}

// Global Cart State for Siswa & Landing
let currentCart = {};

// --- AUTH GUARD & HEADER SETUP ---
async function initAuthHeader(pageRoleRequired = null) {
    const user = await KantinAPI.getCurrentUser();
    
    // Page Protection
    if (pageRoleRequired) {
        if (!user) {
            const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `../auth/login.php?notice=login_required&redirect=${redirectPath}`;
            return null;
        }
        if (pageRoleRequired !== 'any' && user.role !== pageRoleRequired) {
            alert(`Akses ditolak. Halaman ini khusus untuk role: ${pageRoleRequired.toUpperCase()}`);
            if (user.role === 'siswa') window.location.href = '../siswa/index.php';
            else if (user.role === 'petugas') window.location.href = '../petugas/index.php';
            else if (user.role === 'admin') window.location.href = '../admin/index.php';
            return null;
        }
    }

    // Dynamic Header User Info
    const userContainer = document.getElementById('navbar-user-container');
    if (userContainer) {
        if (user) {
            let dashboardUrl = '#';
            if (user.role === 'siswa') dashboardUrl = 'frontend/siswa/index.php';
            else if (user.role === 'petugas') dashboardUrl = 'frontend/petugas/index.php';
            else if (user.role === 'admin') dashboardUrl = 'frontend/admin/index.php';

            userContainer.innerHTML = `
                <a href="${dashboardUrl}" class="btn btn-food-primary me-2">
                    <i class="bi bi-speedometer2 me-1"></i> Dashboard (${escapeHtml(user.nama_lengkap)})
                </a>
                <button onclick="handleLogout()" class="btn btn-food-outline rounded-circle px-3" title="Logout">
                    <i class="bi bi-box-arrow-right"></i>
                </button>
            `;
        } else {
            userContainer.innerHTML = `
                <a href="frontend/auth/login.php" class="btn btn-food-outline me-2">Masuk</a>
                <a href="frontend/auth/register.php" class="btn btn-food-primary">Daftar Akun</a>
            `;
        }
    }

    return user;
}

async function handleLogout() {
    if (confirm('Apakah Anda yakin ingin keluar dari akun?')) {
        await KantinAPI.logout();
        window.location.href = window.location.pathname.includes('/frontend/') ? '../auth/login.php' : 'frontend/auth/login.php';
    }
}

// --- LANDING PAGE CONTROLLER ---
async function initLandingPage() {
    await initAuthHeader();

    const categories = await KantinAPI.getCategories();
    const products = await KantinAPI.getProducts();

    // Render stats
    const totalVarianEl = document.getElementById('stat-total-varian');
    if (totalVarianEl) totalVarianEl.innerText = `${products.length}+`;

    // Render Category Pills
    const catContainer = document.getElementById('categoryFilters');
    if (catContainer) {
        catContainer.innerHTML = `
            <button class="category-pill-food active" onclick="filterLandingCategory('all', this)">Semua Menu</button>
            ${categories.map(c => `
                <button class="category-pill-food" onclick="filterLandingCategory('${c.id}', this)">${escapeHtml(c.nama_kategori)}</button>
            `).join('')}
        `;
    }

    renderLandingProducts(products, categories);
}

function renderLandingProducts(products, categories) {
    const grid = document.getElementById('menuGrid');
    if (!grid) return;

    if (!products.length) {
        grid.innerHTML = `<div class="col-12 text-center text-muted py-5"><p>Belum ada varian menu makanan tersedia.</p></div>`;
        return;
    }

    grid.innerHTML = products.map(p => {
        const cat = categories.find(c => c.id == p.category_id);
        const catName = cat ? cat.nama_kategori : 'Kantin';
        const isOutOfStock = p.stok <= 0;

        return `
            <div class="col-6 col-md-4 col-lg-3 product-card-item" data-category="${p.category_id}" data-name="${escapeHtml(p.nama_produk.toLowerCase())}">
                <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden card-food-hover position-relative">
                    <img src="${p.foto}" class="card-img-top object-fit-cover" alt="${escapeHtml(p.nama_produk)}" style="height: 180px;">
                    <span class="badge bg-white text-dark shadow-sm position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill fw-bold" style="font-size: 0.78rem;">
                        ${escapeHtml(catName)}
                    </span>
                    <div class="card-body p-3 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold text-dark mb-1 text-truncate">${escapeHtml(p.nama_produk)}</h6>
                            <p class="text-muted small text-truncate-2 mb-2" style="font-size: 0.8rem;">${escapeHtml(p.deskripsi || 'Sajian lezat khas kantin sekolah.')}</p>
                        </div>
                        <div>
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="fs-5 fw-bold text-primary">Rp ${formatRupiah(p.harga)}</span>
                                <small class="text-muted fw-semibold">Stok: <span id="stok-landing-${p.id}">${p.stok}</span></small>
                            </div>
                            <a href="frontend/auth/login.php?notice=login_required" class="btn btn-food-primary w-100 rounded-3 ${isOutOfStock ? 'disabled' : ''}">
                                <i class="bi bi-cart-plus me-1"></i> ${isOutOfStock ? 'Stok Habis' : 'Pesan Sekarang'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterLandingCategory(catId, btnEl) {
    if (btnEl) {
        document.querySelectorAll('#categoryFilters .category-pill-food').forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');
    }
    const cards = document.querySelectorAll('.product-card-item');
    cards.forEach(c => {
        if (catId === 'all' || c.dataset.category === String(catId)) {
            c.style.display = 'block';
        } else {
            c.style.display = 'none';
        }
    });
}

function filterLandingSearch() {
    const query = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
    const cards = document.querySelectorAll('.product-card-item');
    cards.forEach(c => {
        const name = c.dataset.name || '';
        if (name.includes(query)) {
            c.style.display = 'block';
        } else {
            c.style.display = 'none';
        }
    });
}

// --- PORTAL SISWA CONTROLLER ---
async function initSiswaPortal() {
    const user = await initAuthHeader('siswa');
    if (!user) return;

    // Load Data
    const categories = await KantinAPI.getCategories();
    const products = await KantinAPI.getProducts();
    const myOrders = await KantinAPI.getUserOrders(user.id);

    // Populate Student Profile Header
    document.querySelectorAll('.student-name-display').forEach(el => el.innerText = user.nama_lengkap);
    document.querySelectorAll('.student-avatar-char').forEach(el => el.innerText = user.nama_lengkap.charAt(0).toUpperCase());
    document.querySelectorAll('.my-orders-count').forEach(el => el.innerText = myOrders.length);

    // Render Categories Strip
    const categoryStrip = document.getElementById('siswaCategoryFilters');
    if (categoryStrip) {
        categoryStrip.innerHTML = `
            <button class="category-pill-food active" onclick="filterSiswaCategory('all', this)">Semua Menu</button>
            ${categories.map(c => `
                <button class="category-pill-food" onclick="filterSiswaCategory('${c.id}', this)">${escapeHtml(c.nama_kategori)}</button>
            `).join('')}
        `;
    }

    renderSiswaProducts(products, categories);
    renderSiswaOrders(myOrders);
}

function renderSiswaProducts(products, categories) {
    const grid = document.getElementById('siswaProductGrid');
    if (!grid) return;

    if (!products.length) {
        grid.innerHTML = `<div class="col-12 text-center text-muted py-5"><p>Tidak ada produk makanan yang tersedia.</p></div>`;
        return;
    }

    grid.innerHTML = products.map(p => {
        const cat = categories.find(c => c.id == p.category_id);
        const catName = cat ? cat.nama_kategori : 'Kantin';
        const inCartQty = currentCart[p.id] ? currentCart[p.id].qty : 0;
        const remainingStok = p.stok - inCartQty;
        const isOutOfStock = remainingStok <= 0;

        return `
            <div class="col-6 col-md-4 col-lg-3 product-item-card" data-category="${p.category_id}" data-name="${escapeHtml(p.nama_produk.toLowerCase())}">
                <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden card-food-hover position-relative">
                    <img src="${p.foto}" class="card-img-top object-fit-cover" alt="${escapeHtml(p.nama_produk)}" style="height: 170px;">
                    <span class="badge bg-white text-dark shadow-sm position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill fw-bold" style="font-size: 0.75rem;">
                        ${escapeHtml(catName)}
                    </span>
                    <div class="card-body p-3 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold text-dark mb-1 text-truncate">${escapeHtml(p.nama_produk)}</h6>
                            <p class="text-muted small text-truncate-2 mb-2" style="font-size: 0.78rem;">${escapeHtml(p.deskripsi || 'Menu kantin pilihan segar.')}</p>
                        </div>
                        <div>
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="fs-5 fw-bold text-primary">Rp ${formatRupiah(p.harga)}</span>
                                <small class="text-muted fw-semibold">Stok: <span id="stok-count-${p.id}">${Math.max(0, remainingStok)}</span></small>
                            </div>
                            <button id="btn-add-${p.id}" class="btn ${isOutOfStock ? 'btn-secondary' : 'btn-food-primary'} w-100 rounded-3" 
                                    onclick="addToCart(${p.id}, '${escapeHtml(p.nama_produk)}', ${p.harga}, ${p.stok})" ${isOutOfStock ? 'disabled' : ''}>
                                <i class="bi ${isOutOfStock ? 'bi-dash-circle' : 'bi-plus-lg'} me-1"></i> ${isOutOfStock ? 'Stok Penuh' : 'Tambah'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function addToCart(id, name, price, maxStok) {
    if (!currentCart[id]) {
        currentCart[id] = { id, name, price, qty: 1, maxStok };
    } else {
        if (currentCart[id].qty < maxStok) {
            currentCart[id].qty++;
        } else {
            alert(`Stok maksimal untuk ${name} adalah ${maxStok}`);
            return;
        }
    }
    updateCartUI();
}

function updateCartQty(id, change) {
    if (!currentCart[id]) return;
    currentCart[id].qty += change;
    if (currentCart[id].qty > currentCart[id].maxStok) {
        alert(`Stok maksimal adalah ${currentCart[id].maxStok}`);
        currentCart[id].qty = currentCart[id].maxStok;
    }
    if (currentCart[id].qty <= 0) {
        delete currentCart[id];
    }
    updateCartUI();
}

function removeFromCart(id) {
    if (currentCart[id]) {
        delete currentCart[id];
        updateCartUI();
    }
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    const summaryTotalEl = document.getElementById('payment-total-summary');
    const badgeCount = document.getElementById('cart-badge-count');
    const sidebarCount = document.getElementById('sidebar-cart-count');
    const btnPayment = document.getElementById('btn-to-payment');

    if (!container) return;
    container.innerHTML = '';

    const keys = Object.keys(currentCart);
    let total = 0;
    let totalItems = 0;

    if (keys.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="bi bi-cart-x fs-1 opacity-50"></i>
                <p class="mt-2 mb-0">Keranjang belanja Anda masih kosong.</p>
            </div>
        `;
        if (btnPayment) btnPayment.disabled = true;
        if (totalEl) totalEl.innerText = 'Rp 0';
        if (summaryTotalEl) summaryTotalEl.innerText = 'Rp 0';
        if (badgeCount) badgeCount.innerText = '0';
        if (sidebarCount) sidebarCount.innerText = '0';
        syncStockButtons();
        return;
    }

    keys.forEach(id => {
        const item = currentCart[id];
        const subtotal = item.price * item.qty;
        total += subtotal;
        totalItems += item.qty;

        container.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                    <h6 class="mb-0 text-dark fw-bold">${escapeHtml(item.name)}</h6>
                    <small class="text-muted">Rp ${formatRupiah(item.price)} x ${item.qty} = <span class="fw-bold text-primary">Rp ${formatRupiah(subtotal)}</span></small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary px-2" onclick="updateCartQty(${id}, -1)">-</button>
                    <span class="fw-bold px-1">${item.qty}</span>
                    <button type="button" class="btn btn-sm btn-outline-secondary px-2" onclick="updateCartQty(${id}, 1)">+</button>
                    <button type="button" class="btn btn-sm btn-outline-danger px-2 ms-1" onclick="removeFromCart(${id})"><i class="bi bi-trash"></i></button>
                </div>
            </div>
        `;
    });

    if (totalEl) totalEl.innerText = 'Rp ' + formatRupiah(total);
    if (summaryTotalEl) summaryTotalEl.innerText = 'Rp ' + formatRupiah(total);
    if (badgeCount) badgeCount.innerText = totalItems;
    if (sidebarCount) sidebarCount.innerText = totalItems;
    if (btnPayment) btnPayment.disabled = false;

    syncStockButtons();
}

function syncStockButtons() {
    KantinAPI.getProducts().then(products => {
        products.forEach(p => {
            const inCart = currentCart[p.id] ? currentCart[p.id].qty : 0;
            const remaining = p.stok - inCart;
            const stokCountSpan = document.getElementById(`stok-count-${p.id}`);
            const btnAdd = document.getElementById(`btn-add-${p.id}`);

            if (stokCountSpan) stokCountSpan.innerText = Math.max(0, remaining);
            if (btnAdd) {
                if (remaining <= 0) {
                    btnAdd.disabled = true;
                    btnAdd.className = 'btn btn-secondary w-100 rounded-3';
                    btnAdd.innerHTML = '<i class="bi bi-dash-circle me-1"></i>Stok Penuh';
                } else {
                    btnAdd.disabled = false;
                    btnAdd.className = 'btn btn-food-primary w-100 rounded-3';
                    btnAdd.innerHTML = '<i class="bi bi-plus-lg me-1"></i>Tambah';
                }
            }
        });
    });
}

async function processSiswaCheckout() {
    const user = window.kantinStore.getCurrentUser();
    const keys = Object.keys(currentCart);
    if (!keys.length) {
        alert('Keranjang Anda kosong!');
        return;
    }

    const metode = document.querySelector('input[name="metode_pembayaran"]:checked')?.value || 'tunai';
    const orderItems = keys.map(id => ({
        product_id: parseInt(id),
        jumlah: currentCart[id].qty
    }));

    try {
        const order = await KantinAPI.createOrder(user.id, orderItems, metode);
        currentCart = {};
        updateCartUI();

        // Close payment modal
        const modalEl = document.getElementById('paymentModal');
        if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }

        alert(`Pesanan berhasil dibuat! Kode Pesanan Anda: ${order.kode_pesanan}`);
        // Reload portal data
        initSiswaPortal();
        switchSiswaTab('riwayat-tab');
    } catch (err) {
        alert('Gagal membuat pesanan: ' + err.message);
    }
}

function renderSiswaOrders(orders) {
    const container = document.getElementById('siswaOrdersContainer');
    if (!container) return;

    if (!orders.length) {
        container.innerHTML = `
            <div class="text-center text-muted py-5">
                <i class="bi bi-receipt-cutoff fs-1 opacity-50"></i>
                <p class="mt-2 mb-0">Anda belum pernah melakukan pemesanan makanan.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(o => `
        <div class="card border-0 shadow-sm rounded-4 mb-3 p-3">
            <div class="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-2 mb-3 gap-2">
                <div>
                    <span class="fw-bold text-dark fs-6">#${escapeHtml(o.kode_pesanan)}</span>
                    <small class="text-muted d-block">${formatDate(o.created_at)}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    ${getPaymentBadge(o.status_pembayaran)}
                    ${getStatusBadge(o.status)}
                </div>
            </div>

            <div class="mb-3">
                ${o.items.map(item => `
                    <div class="d-flex justify-content-between align-items-center small py-1">
                        <span>${escapeHtml(item.nama_produk)} x${item.jumlah}</span>
                        <span class="fw-semibold">Rp ${formatRupiah(item.subtotal)}</span>
                    </div>
                `).join('')}
            </div>

            <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                <div>
                    <small class="text-muted d-block">Total Pembayaran (${o.metode_pembayaran.toUpperCase()})</small>
                    <span class="fs-5 fw-bold text-primary">Rp ${formatRupiah(o.total_harga)}</span>
                </div>
                <a href="nota.php?id=${o.id}" target="_blank" class="btn btn-food-outline btn-sm rounded-pill">
                    <i class="bi bi-receipt me-1"></i> Lihat Struk Nota
                </a>
            </div>
        </div>
    `).join('');
}

function filterSiswaCategory(catId, btnEl) {
    if (btnEl) {
        document.querySelectorAll('#siswaCategoryFilters .category-pill-food').forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');
    }
    const cards = document.querySelectorAll('.product-item-card');
    cards.forEach(c => {
        if (catId === 'all' || c.dataset.category === String(catId)) {
            c.style.display = 'block';
        } else {
            c.style.display = 'none';
        }
    });
}

function switchSiswaTab(tabId) {
    const katalogPane = document.getElementById('katalog-pane');
    const riwayatPane = document.getElementById('riwayat-pane');
    const katalogTab = document.getElementById('katalog-tab');
    const riwayatTab = document.getElementById('riwayat-tab');

    if (tabId === 'riwayat-tab') {
        if (katalogPane) katalogPane.className = 'tab-pane fade';
        if (riwayatPane) riwayatPane.className = 'tab-pane fade show active';
        if (katalogTab) katalogTab.classList.remove('active');
        if (riwayatTab) riwayatTab.classList.add('active');
    } else {
        if (katalogPane) katalogPane.className = 'tab-pane fade show active';
        if (riwayatPane) riwayatPane.className = 'tab-pane fade';
        if (katalogTab) katalogTab.classList.add('active');
        if (riwayatTab) riwayatTab.classList.remove('active');
    }
}

// --- PORTAL PETUGAS CONTROLLER ---
async function initPetugasPortal() {
    const user = await initAuthHeader('petugas');
    if (!user) return;

    const orders = await KantinAPI.getOrders();
    renderPetugasOrders(orders);
}

function renderPetugasOrders(orders) {
    const container = document.getElementById('petugasOrdersList');
    if (!container) return;

    // Stat counts
    let countWait = 0, countProcess = 0, countReady = 0, countDone = 0;
    orders.forEach(o => {
        if (o.status === 'menunggu') countWait++;
        if (o.status === 'diproses') countProcess++;
        if (o.status === 'siap') countReady++;
        if (o.status === 'selesai') countDone++;
    });

    const statWait = document.getElementById('count-wait');
    const statProcess = document.getElementById('count-process');
    const statReady = document.getElementById('count-ready');
    const statDone = document.getElementById('count-done');
    if (statWait) statWait.innerText = countWait;
    if (statProcess) statProcess.innerText = countProcess;
    if (statReady) statReady.innerText = countReady;
    if (statDone) statDone.innerText = countDone;

    if (!orders.length) {
        container.innerHTML = `<div class="text-center text-muted py-5"><p>Belum ada antrean pesanan masuk.</p></div>`;
        return;
    }

    container.innerHTML = orders.map(o => `
        <div class="card border-0 shadow-sm rounded-4 mb-3 p-3">
            <div class="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-2 mb-3 gap-2">
                <div>
                    <span class="badge bg-dark text-white me-2">#${escapeHtml(o.kode_pesanan)}</span>
                    <strong class="text-dark">${escapeHtml(o.nama_pemesan)}</strong>
                    <small class="text-muted d-block mt-1">${formatDate(o.created_at)}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    ${getPaymentBadge(o.status_pembayaran)}
                    ${getStatusBadge(o.status)}
                </div>
            </div>

            <div class="bg-light p-3 rounded-3 mb-3">
                <div class="small fw-bold text-muted mb-2">Item Menu Pesanan:</div>
                ${o.items.map(i => `
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="fw-semibold text-dark">${escapeHtml(i.nama_produk)} x${i.jumlah}</span>
                        <span class="text-primary fw-bold">Rp ${formatRupiah(i.subtotal)}</span>
                    </div>
                `).join('')}
            </div>

            <div class="d-flex flex-wrap justify-content-between align-items-center pt-2 gap-2">
                <div>
                    <small class="text-muted d-block">Total Tagihan (${o.metode_pembayaran.toUpperCase()})</small>
                    <span class="fs-5 fw-bold text-success">Rp ${formatRupiah(o.total_harga)}</span>
                </div>

                <div class="d-flex gap-2">
                    <a href="nota.php?id=${o.id}" target="_blank" class="btn btn-outline-secondary btn-sm rounded-pill" title="Cetak Struk Kasir">
                        <i class="bi bi-printer me-1"></i> Struk
                    </a>
                    ${o.status === 'menunggu' ? `
                        <button onclick="updateStatusPetugas(${o.id}, 'diproses')" class="btn btn-warning btn-sm rounded-pill fw-bold">
                            <i class="bi bi-fire me-1"></i> Proses Pesanan
                        </button>
                    ` : ''}
                    ${o.status === 'diproses' ? `
                        <button onclick="updateStatusPetugas(${o.id}, 'siap')" class="btn btn-primary btn-sm rounded-pill fw-bold">
                            <i class="bi bi-bell-fill me-1"></i> Siap Diambil
                        </button>
                    ` : ''}
                    ${o.status === 'siap' ? `
                        <button onclick="updateStatusPetugas(${o.id}, 'selesai')" class="btn btn-success btn-sm rounded-pill fw-bold">
                            <i class="bi bi-check-lg me-1"></i> Selesaikan
                        </button>
                    ` : ''}
                    ${o.status !== 'selesai' && o.status !== 'dibatalkan' ? `
                        <button onclick="updateStatusPetugas(${o.id}, 'dibatalkan')" class="btn btn-outline-danger btn-sm rounded-pill">
                            <i class="bi bi-x-circle me-1"></i> Batal
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

async function updateStatusPetugas(orderId, status) {
    if (confirm(`Ubah status pesanan ke '${status.toUpperCase()}'?`)) {
        await KantinAPI.updateOrderStatus(orderId, status);
        initPetugasPortal();
    }
}

// --- PORTAL ADMIN CONTROLLER ---
async function initAdminPortal() {
    const user = await initAuthHeader('admin');
    if (!user) return;

    const categories = await KantinAPI.getCategories();
    const products = await KantinAPI.getProducts();

    renderAdminCategoryOptions(categories);
    renderAdminCategoryList(categories);
    renderAdminProductsTable(products, categories);
}

function renderAdminCategoryOptions(categories) {
    const select = document.getElementById('prod_category_id');
    if (!select) return;
    select.innerHTML = categories.map(c => `<option value="${c.id}">${escapeHtml(c.nama_kategori)}</option>`).join('');
}

function renderAdminCategoryList(categories) {
    const list = document.getElementById('adminCategoryList');
    if (!list) return;
    list.innerHTML = categories.map(c => `
        <li class="list-group-item d-flex justify-content-between align-items-center py-2">
            <span class="fw-semibold">${escapeHtml(c.nama_kategori)}</span>
            <button onclick="deleteAdminCategory(${c.id})" class="btn btn-sm btn-outline-danger border-0"><i class="bi bi-trash"></i></button>
        </li>
    `).join('');
}

function renderAdminProductsTable(products, categories) {
    const tbody = document.getElementById('adminProductsTbody');
    if (!tbody) return;

    if (!products.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Belum ada data produk makanan.</td></tr>`;
        return;
    }

    tbody.innerHTML = products.map((p, index) => {
        const cat = categories.find(c => c.id == p.category_id);
        const catName = cat ? cat.nama_kategori : '-';
        return `
            <tr>
                <td class="fw-bold">${index + 1}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${p.foto}" class="rounded-3 me-3 object-fit-cover" style="width: 45px; height: 45px;">
                        <div>
                            <strong class="text-dark d-block">${escapeHtml(p.nama_produk)}</strong>
                            <small class="text-muted">${escapeHtml(p.deskripsi || '')}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge bg-light text-dark border">${escapeHtml(catName)}</span></td>
                <td class="fw-bold text-primary">Rp ${formatRupiah(p.harga)}</td>
                <td>
                    <span class="badge ${p.stok > 5 ? 'bg-success' : 'bg-danger'} px-2 py-1">${p.stok} Porsi</span>
                </td>
                <td>
                    <div class="d-flex gap-1">
                        <button onclick="editAdminProduct(${p.id})" class="btn btn-sm btn-warning text-dark"><i class="bi bi-pencil-square"></i></button>
                        <button onclick="deleteAdminProduct(${p.id})" class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

async function handleSaveAdminCategory(e) {
    e.preventDefault();
    const input = document.getElementById('new_category_name');
    if (!input || !input.value.trim()) return;

    await KantinAPI.addCategory(input.value.trim());
    input.value = '';
    initAdminPortal();
}

async function deleteAdminCategory(id) {
    if (confirm('Hapus kategori ini?')) {
        await KantinAPI.deleteCategory(id);
        initAdminPortal();
    }
}

async function handleSaveAdminProduct(e) {
    e.preventDefault();
    const id = document.getElementById('prod_id').value;
    const catId = document.getElementById('prod_category_id').value;
    const nama = document.getElementById('prod_nama').value.trim();
    const harga = document.getElementById('prod_harga').value;
    const stok = document.getElementById('prod_stok').value;
    const deskripsi = document.getElementById('prod_deskripsi').value.trim();
    const foto = document.getElementById('prod_foto').value.trim();

    await KantinAPI.saveProduct({ id, category_id: catId, nama_produk: nama, harga, stok, deskripsi, foto });

    // Close Modal
    const modalEl = document.getElementById('productModal');
    if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    }

    alert('Data produk berhasil disimpan!');
    initAdminPortal();
}

async function editAdminProduct(id) {
    const products = await KantinAPI.getProducts();
    const p = products.find(item => item.id == id);
    if (!p) return;

    document.getElementById('prod_id').value = p.id;
    document.getElementById('prod_category_id').value = p.category_id;
    document.getElementById('prod_nama').value = p.nama_produk;
    document.getElementById('prod_harga').value = p.harga;
    document.getElementById('prod_stok').value = p.stok;
    document.getElementById('prod_deskripsi').value = p.deskripsi || '';
    document.getElementById('prod_foto').value = p.foto || '';
    document.getElementById('productModalLabel').innerText = 'Edit Produk Makanan';

    const modalEl = document.getElementById('productModal');
    if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
}

function resetProductModalForm() {
    document.getElementById('prod_id').value = '';
    document.getElementById('prod_nama').value = '';
    document.getElementById('prod_harga').value = '';
    document.getElementById('prod_stok').value = '';
    document.getElementById('prod_deskripsi').value = '';
    document.getElementById('prod_foto').value = '';
    document.getElementById('productModalLabel').innerText = 'Tambah Produk Makanan Baru';
}

async function deleteAdminProduct(id) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        await KantinAPI.deleteProduct(id);
        initAdminPortal();
    }
}

// --- LAPORAN ADMIN CONTROLLER ---
async function initAdminLaporan() {
    const user = await initAuthHeader('admin');
    if (!user) return;

    const orders = await KantinAPI.getOrders();
    renderAdminLaporan(orders);
}

function renderAdminLaporan(orders) {
    const tbody = document.getElementById('laporanTbody');
    const totalOmzetEl = document.getElementById('total-omzet-display');
    const totalPesananEl = document.getElementById('total-pesanan-display');

    if (!tbody) return;

    let totalOmzet = 0;
    let validCount = 0;

    if (!orders.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Belum ada data transaksi pesanan.</td></tr>`;
        if (totalOmzetEl) totalOmzetEl.innerText = 'Rp 0';
        if (totalPesananEl) totalPesananEl.innerText = '0 Pesanan';
        return;
    }

    tbody.innerHTML = orders.map((o, index) => {
        if (o.status !== 'dibatalkan' && o.status_pembayaran === 'lunas') {
            totalOmzet += o.total_harga;
            validCount++;
        }

        const itemListStr = o.items.map(i => `${i.nama_produk} (x${i.jumlah})`).join(', ');

        return `
            <tr>
                <td class="fw-bold">${index + 1}</td>
                <td><span class="badge bg-dark">${escapeHtml(o.kode_pesanan)}</span></td>
                <td>${formatDate(o.created_at)}</td>
                <td class="fw-semibold">${escapeHtml(o.nama_pemesan)}</td>
                <td class="small text-muted">${escapeHtml(itemListStr)}</td>
                <td class="fw-bold text-success">Rp ${formatRupiah(o.total_harga)}</td>
                <td>
                    ${getStatusBadge(o.status)}
                    <span class="ms-1">${getPaymentBadge(o.status_pembayaran)}</span>
                </td>
            </tr>
        `;
    }).join('');

    if (totalOmzetEl) totalOmzetEl.innerText = 'Rp ' + formatRupiah(totalOmzet);
    if (totalPesananEl) totalPesananEl.innerText = `${validCount} Transaksi Lunas`;
}

// --- NOTA CONTROLLER ---
async function initNotaPage() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');

    if (!orderId) {
        document.body.innerHTML = `<div class="container py-5 text-center"><h3>Kode/ID Pesanan Tidak Ditemukan</h3></div>`;
        return;
    }

    const order = await KantinAPI.getOrderById(orderId);
    if (!order) {
        document.body.innerHTML = `<div class="container py-5 text-center"><h3>Pesanan #${escapeHtml(orderId)} Tidak Ditemukan</h3></div>`;
        return;
    }

    // Populate Nota Elements
    document.querySelectorAll('.nota-kode').forEach(el => el.innerText = `#${order.kode_pesanan}`);
    document.querySelectorAll('.nota-tanggal').forEach(el => el.innerText = formatDate(order.created_at));
    document.querySelectorAll('.nota-pemesan').forEach(el => el.innerText = order.nama_pemesan);
    document.querySelectorAll('.nota-metode').forEach(el => el.innerText = order.metode_pembayaran.toUpperCase());
    document.querySelectorAll('.nota-status').forEach(el => el.innerHTML = getStatusBadge(order.status));
    document.querySelectorAll('.nota-pembayaran').forEach(el => el.innerHTML = getPaymentBadge(order.status_pembayaran));
    document.querySelectorAll('.nota-total').forEach(el => el.innerText = 'Rp ' + formatRupiah(order.total_harga));

    const tbody = document.getElementById('notaItemsTbody');
    if (tbody) {
        tbody.innerHTML = order.items.map((item, idx) => `
            <tr>
                <td class="text-center">${idx + 1}</td>
                <td>
                    <strong class="text-dark d-block">${escapeHtml(item.nama_produk)}</strong>
                    <small class="text-muted">Rp ${formatRupiah(item.harga_satuan)} / porsi</small>
                </td>
                <td class="text-center fw-bold">${item.jumlah}</td>
                <td class="text-end fw-bold">Rp ${formatRupiah(item.subtotal)}</td>
            </tr>
        `).join('');
    }
}

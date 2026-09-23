/**
 * KantinKu JavaScript Logic
 * Handles interactive shopping cart, calculations, modal sync, and UI enhancements.
 */

document.addEventListener('DOMContentLoaded', function () {
    initCart();
    initCategoryFilter();
    initQuickLogin();
});

// Cart State
let cart = {};

function initCart() {
    const cartContainer = document.getElementById('cart-items-container');
    if (!cartContainer) return; // Not on Siswa ordering page

    // Attach click events to "Tambah ke Keranjang" buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            const maxStok = parseInt(this.dataset.stok);

            if (!cart[id]) {
                cart[id] = {
                    id: id,
                    name: name,
                    price: price,
                    qty: 1,
                    maxStok: maxStok
                };
            } else {
                if (cart[id].qty < maxStok) {
                    cart[id].qty++;
                } else {
                    alert(`Stok maksimal untuk ${name} adalah ${maxStok}`);
                    return;
                }
            }

            renderCart();
        });
    });
}

function updateQty(id, change) {
    if (!cart[id]) return;

    cart[id].qty += change;

    if (cart[id].qty > cart[id].maxStok) {
        alert(`Stok maksimal adalah ${cart[id].maxStok}`);
        cart[id].qty = cart[id].maxStok;
    }

    if (cart[id].qty <= 0) {
        delete cart[id];
    }

    renderCart();
}

function removeFromCart(id) {
    if (cart[id]) {
        delete cart[id];
        renderCart();
    }
}

function renderCart() {
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total-price');
    const paymentTotalSummary = document.getElementById('payment-total-summary');
    const cartBadgeCount = document.getElementById('cart-badge-count');
    const sidebarCartCount = document.getElementById('sidebar-cart-count');
    const btnToPayment = document.getElementById('btn-to-payment');
    const checkoutBtn = document.getElementById('btn-checkout');
    const cartFormInputs = document.getElementById('cart-form-inputs');

    if (!cartContainer) return;

    cartContainer.innerHTML = '';
    if (cartFormInputs) cartFormInputs.innerHTML = '';

    let total = 0;
    let totalItems = 0;

    const keys = Object.keys(cart);

    if (keys.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="bi bi-cart-x fs-1 opacity-50"></i>
                <p class="mt-2 mb-0">Keranjang masih kosong</p>
            </div>
        `;
        if (btnToPayment) btnToPayment.disabled = true;
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (cartTotalElement) cartTotalElement.innerText = 'Rp 0';
        if (paymentTotalSummary) paymentTotalSummary.innerText = 'Rp 0';
        if (cartBadgeCount) cartBadgeCount.innerText = '0';
        if (sidebarCartCount) sidebarCartCount.innerText = '0';
        updateProductCardStockUI();
        return;
    }

    keys.forEach((id, index) => {
        const item = cart[id];
        const itemSubtotal = item.price * item.qty;
        total += itemSubtotal;
        totalItems += item.qty;

        // Render UI item in cart modal
        const itemEl = document.createElement('div');
        itemEl.className = 'd-flex justify-content-between align-items-center mb-3 pb-2 border-bottom';
        itemEl.innerHTML = `
            <div>
                <h6 class="mb-0 text-dark fw-bold">${escapeHtml(item.name)}</h6>
                <small class="text-muted">Rp ${formatRupiah(item.price)} x ${item.qty} = <span class="fw-bold text-primary">Rp ${formatRupiah(itemSubtotal)}</span></small>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn btn-sm btn-outline-secondary px-2" onclick="updateQty(${id}, -1)">-</button>
                <span class="fw-bold px-1">${item.qty}</span>
                <button type="button" class="btn btn-sm btn-outline-secondary px-2" onclick="updateQty(${id}, 1)">+</button>
                <button type="button" class="btn btn-sm btn-outline-danger px-2 ms-1" onclick="removeFromCart(${id})"><i class="bi bi-trash"></i></button>
            </div>
        `;
        cartContainer.appendChild(itemEl);

        // Generate hidden inputs for Form POST submission in payment form
        if (cartFormInputs) {
            const inputId = document.createElement('input');
            inputId.type = 'hidden';
            inputId.name = `items[${index}][product_id]`;
            inputId.value = item.id;

            const inputQty = document.createElement('input');
            inputQty.type = 'hidden';
            inputQty.name = `items[${index}][jumlah]`;
            inputQty.value = item.qty;

            cartFormInputs.appendChild(inputId);
            cartFormInputs.appendChild(inputQty);
        }
    });

    if (cartTotalElement) cartTotalElement.innerText = 'Rp ' + formatRupiah(total);
    if (paymentTotalSummary) paymentTotalSummary.innerText = 'Rp ' + formatRupiah(total);
    if (cartBadgeCount) cartBadgeCount.innerText = totalItems;
    if (sidebarCartCount) sidebarCartCount.innerText = totalItems;
    if (btnToPayment) btnToPayment.disabled = (keys.length === 0);
    if (checkoutBtn) checkoutBtn.disabled = (keys.length === 0);

    // Update real-time remaining stock counter on product cards
    updateProductCardStockUI();
}

function updateProductCardStockUI() {
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        const id = btn.dataset.id;
        const maxStok = parseInt(btn.dataset.stok);
        const inCartQty = cart[id] ? cart[id].qty : 0;
        const remainingStok = maxStok - inCartQty;

        const stokSpan = document.getElementById('stok-count-' + id);
        if (stokSpan) {
            stokSpan.innerText = Math.max(0, remainingStok);
        }

        if (remainingStok <= 0) {
            btn.disabled = true;
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
            btn.innerHTML = '<i class="bi bi-dash-circle me-1"></i>Penuh';
        } else {
            btn.disabled = false;
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
            btn.innerHTML = '<i class="bi bi-plus-lg me-1"></i>Tambah';
        }
    });
}

// Category Filter on Siswa Page
function initCategoryFilter() {
    const filterButtons = document.querySelectorAll('[data-filter-category]');
    if (!filterButtons.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const categoryId = this.dataset.filterCategory;
            const productCards = document.querySelectorAll('.product-item-card');

            productCards.forEach(card => {
                if (categoryId === 'all' || card.dataset.category === categoryId) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Quick Login helpers for demo mode
function initQuickLogin() {
    window.quickLogin = function (role) {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        if (!usernameInput || !passwordInput) return;

        if (role === 'admin') {
            usernameInput.value = 'admin';
            passwordInput.value = 'password123';
        } else if (role === 'petugas') {
            usernameInput.value = 'petugas';
            passwordInput.value = 'password123';
        } else if (role === 'siswa') {
            usernameInput.value = 'siswa';
            passwordInput.value = 'password123';
        }
    };
}

// Helpers
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}

function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}

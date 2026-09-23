/**
 * KantinKu API Wrapper (Pure Frontend & PHP REST API Bridge)
 * Configured to work in Client-Side Mock mode, and seamlessly switches to PHP API endpoints.
 */

const USE_MOCK_API = true; // Set to false when connecting to PHP REST API backend

const KantinAPI = {
    // --- AUTH ---
    async getCurrentUser() {
        if (USE_MOCK_API) {
            return window.kantinStore.getCurrentUser();
        }
        try {
            const res = await fetch('../../backend/api/auth.php?action=check_session');
            if (!res.ok) return null;
            const data = await res.json();
            return data.user || null;
        } catch (error) {
            return null;
        }
    },

    async login(username, password) {
        if (USE_MOCK_API) {
            return window.kantinStore.login(username, password);
        }
        const res = await fetch('../../backend/api/auth.php?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return await res.json();
    },

    async register(username, password, nama_lengkap, no_hp) {
        if (USE_MOCK_API) {
            return window.kantinStore.register(username, password, nama_lengkap, no_hp);
        }
        const res = await fetch('../../backend/api/auth.php?action=register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, nama_lengkap, no_hp })
        });
        return await res.json();
    },

    async logout() {
        if (USE_MOCK_API) {
            window.kantinStore.logout();
            return { success: true };
        }
        await fetch('../../backend/api/auth.php?action=logout');
        return { success: true };
    },

    // --- CATEGORIES ---
    async getCategories() {
        if (USE_MOCK_API) {
            return window.kantinStore.getCategories();
        }
        const res = await fetch('../../backend/api/kategori.php?action=list');
        return await res.json();
    },

    async addCategory(nama_kategori) {
        if (USE_MOCK_API) {
            return window.kantinStore.addCategory(nama_kategori);
        }
        const res = await fetch('../../backend/api/kategori.php?action=create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama_kategori })
        });
        return await res.json();
    },

    async deleteCategory(id) {
        if (USE_MOCK_API) {
            window.kantinStore.deleteCategory(id);
            return { success: true };
        }
        const res = await fetch(`../../backend/api/kategori.php?action=delete&id=${id}`, { method: 'DELETE' });
        return await res.json();
    },

    // --- PRODUCTS ---
    async getProducts() {
        if (USE_MOCK_API) {
            return window.kantinStore.getProducts();
        }
        const res = await fetch('../../backend/api/produk.php?action=list');
        return await res.json();
    },

    async saveProduct(productData) {
        if (USE_MOCK_API) {
            window.kantinStore.saveProduct(productData);
            return { success: true };
        }
        const action = productData.id ? 'update' : 'create';
        const res = await fetch(`../../backend/api/produk.php?action=${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        return await res.json();
    },

    async deleteProduct(id) {
        if (USE_MOCK_API) {
            window.kantinStore.deleteProduct(id);
            return { success: true };
        }
        const res = await fetch(`../../backend/api/produk.php?action=delete&id=${id}`, { method: 'DELETE' });
        return await res.json();
    },

    // --- ORDERS ---
    async getOrders() {
        if (USE_MOCK_API) {
            return window.kantinStore.getOrders();
        }
        const res = await fetch('../../backend/api/pesanan.php?action=all_orders');
        return await res.json();
    },

    async getUserOrders(userId) {
        if (USE_MOCK_API) {
            return window.kantinStore.getUserOrders(userId);
        }
        const res = await fetch(`../../backend/api/pesanan.php?action=user_orders&user_id=${userId}`);
        return await res.json();
    },

    async getOrderById(id) {
        if (USE_MOCK_API) {
            return window.kantinStore.getOrderById(id);
        }
        const res = await fetch(`../../backend/api/pesanan.php?action=detail&id=${id}`);
        return await res.json();
    },

    async createOrder(userId, items, metodePembayaran) {
        if (USE_MOCK_API) {
            return window.kantinStore.createOrder(userId, items, metodePembayaran);
        }
        const res = await fetch('../../backend/api/pesanan.php?action=create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, items, metodePembayaran })
        });
        return await res.json();
    },

    async updateOrderStatus(orderId, status, statusPembayaran = null) {
        if (USE_MOCK_API) {
            return window.kantinStore.updateOrderStatus(orderId, status, statusPembayaran);
        }
        const res = await fetch('../../backend/api/pesanan.php?action=update_status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status, statusPembayaran })
        });
        return await res.json();
    }
};

window.KantinAPI = KantinAPI;

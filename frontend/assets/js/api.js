/** Frontend client for the PHP API. */
const BACKEND_API_ENABLED = false;
const API_BASE_URL = new URL('../../../backend/api/', document.currentScript.src);

async function apiRequest(path, options = {}) {
    if (!BACKEND_API_ENABLED) {
        throw new Error('Backend PHP belum dihubungkan.');
    }

    let response;
    try {
        response = await fetch(new URL(path, API_BASE_URL), {
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                ...(options.body ? { 'Content-Type': 'application/json' } : {})
            },
            ...options
        });
    } catch (error) {
        throw new Error('Tidak dapat terhubung ke server PHP.');
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(data?.message || `Permintaan gagal (HTTP ${response.status}).`);
    }
    if (data === null) {
        throw new Error('Respons server bukan JSON yang valid.');
    }
    return data;
}

function jsonBody(data) {
    return JSON.stringify(data);
}

const KantinAPI = {
    isBackendEnabled() {
        return BACKEND_API_ENABLED;
    },

    async getCurrentUser() {
        if (!BACKEND_API_ENABLED) return null;
        try {
            const data = await apiRequest('auth.php?action=check_session');
            return data.user || null;
        } catch (error) {
            return null;
        }
    },

    async login(username, password) {
        if (!BACKEND_API_ENABLED) {
            return { success: false, message: 'Backend PHP belum dihubungkan.' };
        }
        return apiRequest('auth.php?action=login', {
            method: 'POST',
            body: jsonBody({ username, password })
        });
    },

    async register(username, password, nama_lengkap, no_hp) {
        if (!BACKEND_API_ENABLED) {
            return { success: false, message: 'Backend PHP belum dihubungkan.' };
        }
        return apiRequest('auth.php?action=register', {
            method: 'POST',
            body: jsonBody({ username, password, nama_lengkap, no_hp })
        });
    },

    async logout() {
        if (!BACKEND_API_ENABLED) return { success: true };
        return apiRequest('auth.php?action=logout', { method: 'POST' });
    },

    async getCategories() {
        if (!BACKEND_API_ENABLED) return [];
        return apiRequest('kategori.php?action=list');
    },

    async addCategory(nama_kategori) {
        if (!BACKEND_API_ENABLED) return { success: false, message: 'Backend PHP belum dihubungkan.' };
        return apiRequest('kategori.php?action=create', {
            method: 'POST',
            body: jsonBody({ nama_kategori })
        });
    },

    async deleteCategory(id) {
        if (!BACKEND_API_ENABLED) return { success: false, message: 'Backend PHP belum dihubungkan.' };
        const query = new URLSearchParams({ action: 'delete', id: String(id) });
        return apiRequest(`kategori.php?${query}`, { method: 'DELETE' });
    },

    async getProducts() {
        if (!BACKEND_API_ENABLED) return [];
        return apiRequest('produk.php?action=list');
    },

    async saveProduct(productData) {
        if (!BACKEND_API_ENABLED) return { success: false, message: 'Backend PHP belum dihubungkan.' };
        const action = productData.id ? 'update' : 'create';
        return apiRequest(`produk.php?action=${action}`, {
            method: 'POST',
            body: jsonBody(productData)
        });
    },

    async deleteProduct(id) {
        if (!BACKEND_API_ENABLED) return { success: false, message: 'Backend PHP belum dihubungkan.' };
        const query = new URLSearchParams({ action: 'delete', id: String(id) });
        return apiRequest(`produk.php?${query}`, { method: 'DELETE' });
    },

    async getOrders() {
        if (!BACKEND_API_ENABLED) return [];
        return apiRequest('pesanan.php?action=all_orders');
    },

    async getUserOrders() {
        if (!BACKEND_API_ENABLED) return [];
        return apiRequest('pesanan.php?action=user_orders');
    },

    async getOrderById(id) {
        if (!BACKEND_API_ENABLED) return null;
        const query = new URLSearchParams({ action: 'detail', id: String(id) });
        return apiRequest(`pesanan.php?${query}`);
    },

    async createOrder(items, metodePembayaran) {
        if (!BACKEND_API_ENABLED) throw new Error('Backend PHP belum dihubungkan.');
        return apiRequest('pesanan.php?action=create', {
            method: 'POST',
            body: jsonBody({ items, metodePembayaran })
        });
    },

    async updateOrderStatus(orderId, status, statusPembayaran = null) {
        if (!BACKEND_API_ENABLED) return { success: false, message: 'Backend PHP belum dihubungkan.' };
        return apiRequest('pesanan.php?action=update_status', {
            method: 'POST',
            body: jsonBody({ orderId, status, statusPembayaran })
        });
    }
};

window.KantinAPI = KantinAPI;

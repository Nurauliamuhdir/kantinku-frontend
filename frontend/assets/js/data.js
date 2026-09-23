/**
 * KantinKu In-Memory Temporary Store (Non-Persistent Mode for Educational Demo)
 * Disables localStorage persistence so that data resets on page refresh,
 * clearly demonstrating to students the difference between frontend-only vs MySQL Database.
 */

// Enable In-Memory Temporary Storage Only (Resets on Refresh)
const USE_PERSISTENT_STORAGE = false;

const STORAGE_KEYS = {
    USERS: 'kantinku_users',
    CATEGORIES: 'kantinku_categories',
    PRODUCTS: 'kantinku_products',
    ORDERS: 'kantinku_orders',
    SESSION: 'kantinku_session'
};

// Initial Seed Data
const DEFAULT_USERS = [
    { id: 1, username: 'admin', password: 'password123', nama_lengkap: 'Administrator Utama', no_hp: '08120000001', role: 'admin' },
    { id: 2, username: 'petugas', password: 'password123', nama_lengkap: 'Petugas Kantin 1', no_hp: '08120000002', role: 'petugas' },
    { id: 3, username: 'siswa', password: 'password123', nama_lengkap: 'Fulana bin Fulan', no_hp: '08120000003', role: 'siswa' }
];

const DEFAULT_CATEGORIES = [
    { id: 1, nama_kategori: 'Makanan Berat' },
    { id: 2, nama_kategori: 'Camilan & Snack' },
    { id: 3, nama_kategori: 'Minuman Segar' }
];

const DEFAULT_PRODUCTS = [
    {
        id: 1,
        category_id: 1,
        nama_produk: 'Ayam Geprek Sambal Ijo',
        harga: 18000,
        stok: 15,
        deskripsi: 'Nasi + Ayam Geprek crispy dengan sambal ijo pedas segar.',
        foto: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80'
    },
    {
        id: 2,
        category_id: 1,
        nama_produk: 'Nasi Goreng Spesial',
        harga: 15000,
        stok: 20,
        deskripsi: 'Nasi goreng dengan telur ceplok dan suwiran ayam gurih.',
        foto: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80'
    },
    {
        id: 3,
        category_id: 2,
        nama_produk: 'Roti Bakar Cokelat Keju',
        harga: 10000,
        stok: 12,
        deskripsi: 'Roti bakar empuk isi cokelat lumer dan keju parut melimpah.',
        foto: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=500&auto=format&fit=crop&q=80'
    },
    {
        id: 4,
        category_id: 3,
        nama_produk: 'Es Teh Manis Jumbo',
        harga: 5000,
        stok: 50,
        deskripsi: 'Es teh manis segar porsi jumbo penyegar haus jam istirahat.',
        foto: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80'
    }
];

const DEFAULT_ORDERS = [
    {
        id: 101,
        user_id: 3,
        nama_pemesan: 'Fulana binnn Fulan',
        kode_pesanan: 'ORD-20260918-001',
        total_harga: 23000,
        metode_pembayaran: 'qris',
        status_pembayaran: 'lunas',
        status: 'diproses',
        created_at: new Date(Date.now() - 30 * 60000).toISOString(),
        items: [
            { product_id: 1, nama_produk: 'Ayam Geprek Sambal Ijo', jumlah: 1, harga_satuan: 18000, subtotal: 18000 },
            { product_id: 4, nama_produk: 'Es Teh Manis Jumbo', jumlah: 1, harga_satuan: 5000, subtotal: 5000 }
        ]
    }
];

class KantinStore {
    constructor() {
        this.init();
    }

    init() {
        if (!USE_PERSISTENT_STORAGE) {
            // Clean up old localStorage so data resets on refresh
            localStorage.removeItem(STORAGE_KEYS.USERS);
            localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
            localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
            localStorage.removeItem(STORAGE_KEYS.ORDERS);

            // Use temporary sessionStorage (In-memory per tab session)
            if (!sessionStorage.getItem(STORAGE_KEYS.USERS)) {
                sessionStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
            }
            if (!sessionStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
                sessionStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
            }
            if (!sessionStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
                sessionStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
            }
            if (!sessionStorage.getItem(STORAGE_KEYS.ORDERS)) {
                sessionStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
            }
        } else {
            if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
            }
            if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
                localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
            }
            if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
                localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
            }
            if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
                localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
            }
        }
    }

    getStorageEngine() {
        return USE_PERSISTENT_STORAGE ? localStorage : sessionStorage;
    }

    // --- SESSION / AUTH MANAGEMENT ---
    getCurrentUser() {
        const session = this.getStorageEngine().getItem(STORAGE_KEYS.SESSION);
        return session ? JSON.parse(session) : null;
    }

    login(username, password) {
        const users = JSON.parse(this.getStorageEngine().getItem(STORAGE_KEYS.USERS) || '[]');
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase().trim() && u.password === password.trim());
        if (user) {
            const sessionData = {
                id: user.id,
                username: user.username,
                nama_lengkap: user.nama_lengkap,
                no_hp: user.no_hp,
                role: user.role
            };
            this.getStorageEngine().setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
            return { success: true, user: sessionData };
        }
        return { success: false, message: 'Username atau password yang Anda masukkan salah!' };
    }

    register(username, password, nama_lengkap, no_hp) {
        const users = JSON.parse(this.getStorageEngine().getItem(STORAGE_KEYS.USERS) || '[]');
        if (users.some(u => u.username.toLowerCase() === username.toLowerCase().trim())) {
            return { success: false, message: 'Username sudah digunakan, silakan pilih username lain.' };
        }
        const newUser = {
            id: Date.now(),
            username: username.trim(),
            password: password.trim(),
            nama_lengkap: nama_lengkap.trim(),
            no_hp: no_hp.trim(),
            role: 'siswa'
        };
        users.push(newUser);
        this.getStorageEngine().setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return { success: true, message: 'Pendaftaran berhasil! Silakan login dengan akun Anda.' };
    }

    logout() {
        this.getStorageEngine().removeItem(STORAGE_KEYS.SESSION);
    }

    // --- CATEGORY CRUD ---
    getCategories() {
        return JSON.parse(this.getStorageEngine().getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    }

    addCategory(nama_kategori) {
        const categories = this.getCategories();
        const newCat = {
            id: Date.now(),
            nama_kategori: nama_kategori.trim()
        };
        categories.push(newCat);
        this.getStorageEngine().setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
        return newCat;
    }

    deleteCategory(id) {
        let categories = this.getCategories();
        categories = categories.filter(c => c.id != id);
        this.getStorageEngine().setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }

    // --- PRODUCT CRUD ---
    getProducts() {
        return JSON.parse(this.getStorageEngine().getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    }

    getProductById(id) {
        return this.getProducts().find(p => p.id == id);
    }

    saveProduct(productData) {
        let products = this.getProducts();
        if (productData.id) {
            // Update
            const index = products.findIndex(p => p.id == productData.id);
            if (index !== -1) {
                products[index] = { ...products[index], ...productData };
            }
        } else {
            // Create
            const newProduct = {
                id: Date.now(),
                category_id: parseInt(productData.category_id),
                nama_produk: productData.nama_produk,
                harga: parseFloat(productData.harga),
                stok: parseInt(productData.stok),
                deskripsi: productData.deskripsi || '',
                foto: productData.foto || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
            };
            products.push(newProduct);
        }
        this.getStorageEngine().setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id != id);
        this.getStorageEngine().setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }

    // --- ORDERS MANAGEMENT ---
    getOrders() {
        return JSON.parse(this.getStorageEngine().getItem(STORAGE_KEYS.ORDERS) || '[]');
    }

    getUserOrders(userId) {
        return this.getOrders().filter(o => o.user_id == userId);
    }

    getOrderById(id) {
        return this.getOrders().find(o => o.id == id || o.kode_pesanan === id);
    }

    createOrder(userId, items, metodePembayaran) {
        const user = this.getCurrentUser();
        const products = this.getProducts();
        let totalHarga = 0;
        const orderItems = [];

        items.forEach(item => {
            const product = products.find(p => p.id == item.product_id);
            if (product) {
                if (product.stok < item.jumlah) {
                    throw new Error(`Stok untuk ${product.nama_produk} tidak mencukupi!`);
                }
                product.stok -= item.jumlah;
                const subtotal = product.harga * item.jumlah;
                totalHarga += subtotal;

                orderItems.push({
                    product_id: product.id,
                    nama_produk: product.nama_produk,
                    jumlah: item.jumlah,
                    harga_satuan: product.harga,
                    subtotal: subtotal
                });
            }
        });

        // Save updated products stock
        this.getStorageEngine().setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

        const now = new Date();
        const randNum = Math.floor(100 + Math.random() * 900);
        const kodePesanan = `ORD-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${randNum}`;

        const newOrder = {
            id: Date.now(),
            user_id: userId,
            nama_pemesan: user ? user.nama_lengkap : 'Siswa',
            kode_pesanan: kodePesanan,
            total_harga: totalHarga,
            metode_pembayaran: metodePembayaran,
            status_pembayaran: (metodePembayaran === 'qris') ? 'lunas' : 'belum_bayar',
            status: 'menunggu',
            created_at: now.toISOString(),
            items: orderItems
        };

        const orders = this.getOrders();
        orders.unshift(newOrder);
        this.getStorageEngine().setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

        return newOrder;
    }

    updateOrderStatus(orderId, status, statusPembayaran = null) {
        const orders = this.getOrders();
        const order = orders.find(o => o.id == orderId || o.kode_pesanan === orderId);
        if (order) {
            order.status = status;
            if (statusPembayaran) {
                order.status_pembayaran = statusPembayaran;
            } else if (status === 'selesai' || status === 'siap') {
                order.status_pembayaran = 'lunas';
            }
            this.getStorageEngine().setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
            return order;
        }
        return null;
    }
}

// Global Singleton Instance
window.kantinStore = new KantinStore();

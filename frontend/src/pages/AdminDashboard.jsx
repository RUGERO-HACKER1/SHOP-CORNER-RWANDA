
import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Upload, X, Package, Users, ShoppingBag, LayoutDashboard, DollarSign, Edit, BarChart, Mail, Menu, MapPin, Phone, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSocket } from '../context/SocketContext';
import { API_URL } from '../config';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const socket = useSocket();

    // Tabs
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [inventoryFilter, setInventoryFilter] = useState('all'); // all, low, out

    // Data
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);

    // Edit/Create Modal (Product)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        title: '', description: '', price: '', originalPrice: '',
        category: 'Dresses', sizes: '', image: null, image2: null, stockQuantity: 0, variants: []
    });

    // Order Detail Modal
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderFilter, setOrderFilter] = useState('all');
    const [orderSearch, setOrderSearch] = useState('');

    // Analytics State
    const [timeRange, setTimeRange] = useState('all');
    const [shopSentiment, setShopSentiment] = useState('');
    const [isSentimentLoading, setIsSentimentLoading] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user, navigate]);

    // Real-time Updates
    useEffect(() => {
        if (socket) {
            socket.on('orderUpdate', (updatedOrder) => {
                setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
            });

            return () => {
                socket.off('orderUpdate');
            };
        }
    }, [socket]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const checkAuth = async (res) => {
                if (res.status === 401) {
                    logout();
                    // Optional: alert('Session expired. Please login again.');
                    return false;
                }
                return true;
            };

            const [resProd, resOrd, resUsers, resMsgs] = await Promise.all([
                fetch(`${API_URL}/api/products`),
                fetch(`${API_URL}/api/orders`, { headers }),
                fetch(`${API_URL}/api/auth`, { headers }),
                fetch(`${API_URL}/api/contact`, { headers })
            ]);

            // Check if any admin endpoint returned 401
            if (!(await checkAuth(resOrd)) || !(await checkAuth(resUsers))) return;

            setProducts(await resProd.json());
            const ordersData = await resOrd.json();
            setOrders(Array.isArray(ordersData) ? ordersData : []);
            const usersData = await resUsers.json();
            setUsers(Array.isArray(usersData) ? usersData : []);
            const msgsData = await resMsgs.json();
            setMessages(Array.isArray(msgsData) ? msgsData : []);
        } catch (err) { console.error('Data fetch failed', err); }
    };



    const handleShareLocation = async (orderId) => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        const confirmShare = window.confirm("Share your current location as the order's tracking location?");
        if (!confirmShare) return;

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/api/orders/${orderId}/location`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                });

                if (res.ok) {
                    const updatedOrder = await res.json();
                    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
                    if (selectedOrder && selectedOrder.id === updatedOrder.id) {
                        setSelectedOrder(updatedOrder);
                    }
                    alert('Location shared! The customer can now see this location.');
                } else {
                    alert('Failed to share location');
                }
            } catch (err) {
                console.error(err);
                alert('Error sharing location');
            }
        }, (error) => {
            console.error(error);
            alert('Unable to retrieve your location. Allow location access.');
        });
    };
    const fetchSentiment = async () => {
        setIsSentimentLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/reviews/sentiment`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.sentiment) setShopSentiment(data.sentiment);
        } catch (err) { console.error('Sentiment fetch failed', err); }
        finally { setIsSentimentLoading(false); }
    };

    // --- Product Handlers ---
    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleUpdateStock = async (id, newQty) => {
        if (newQty < 0) newQty = 0;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/products/${id}/stock`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ stockQuantity: newQty })
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                alert(data.message || 'Failed to update stock');
                return;
            }
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Error updating stock');
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);

            // Extract related IDs from variants if it exists (assuming it's stored as [id1, id2] or {related: [id1]})
            let relatedIdsStr = '';
            if (Array.isArray(product.variants)) {
                relatedIdsStr = product.variants.join(', ');
            } else if (product.variants && Array.isArray(product.variants.relatedIds)) {
                relatedIdsStr = product.variants.relatedIds.join(', ');
            }

            setProductForm({
                title: product.title,
                description: product.description,
                price: product.price,
                // Hidden fields get defaults or existing values
                originalPrice: product.originalPrice || '',
                category: product.category || 'General',
                sizes: Array.isArray(product.sizes) ? product.sizes.join(',') : (product.sizes || 'One Size'),
                // Image Handling
                image: null, // New Main Image (file)
                newGalleryFiles: [], // New Gallery Images (files)
                currentImages: Array.isArray(product.images)
                    ? product.images
                    : (typeof product.images === 'string'
                        ? (product.images.startsWith('[') ? JSON.parse(product.images) : [product.images])
                        : (product.image ? [product.image] : [])), // Existing URLs
                stockQuantity: product.stockQuantity || 100,
                // We use 'variants' field to store the RELATED IDs string for the form input
                variants: relatedIdsStr
            });
        } else {
            setEditingProduct(null);
            setProductForm({
                title: '',
                description: '',
                price: '',
                // Defaults for new products since fields are hidden
                originalPrice: '',
                category: 'General',
                sizes: 'One Size',
                image: null,
                stockQuantity: 100,
                variants: '' // Empty string for new product
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            // Handle regular fields
            Object.keys(productForm).forEach(key => {
                if (key === 'variants' || key === 'newGalleryFiles' || key === 'currentImages' || key === 'image') return; // Handle these manually
                if (productForm[key] !== null) formData.append(key, productForm[key]);
            });

            // Handle Related IDs (Variants)
            // Parse string "1, 2" -> Array [1, 2] -> JSON String "[1,2]"
            let variantsArray = [];
            if (typeof productForm.variants === 'string') {
                variantsArray = productForm.variants.split(',')
                    .map(s => parseInt(s.trim()))
                    .filter(n => !isNaN(n));
            } else if (Array.isArray(productForm.variants)) {
                variantsArray = productForm.variants;
            }
            formData.append('variants', JSON.stringify(variantsArray));

            // Handle Images
            if (productForm.image) {
                formData.append('image', productForm.image);
            }
            // Gallery Images (New)
            if (productForm.newGalleryFiles && productForm.newGalleryFiles.length > 0) {
                productForm.newGalleryFiles.forEach(file => {
                    formData.append('images', file);
                });
            }
            // Existing Images (to keep)
            if (productForm.currentImages && productForm.currentImages.length > 0) {
                formData.append('existingImages', JSON.stringify(productForm.currentImages));
            } else {
                formData.append('existingImages', JSON.stringify([]));
            }


            const token = localStorage.getItem('token');

            const url = editingProduct
                ? `${API_URL}/api/products/${editingProduct.id}`
                : `${API_URL}/api/products`;
            const method = editingProduct ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (res.status === 401) {
                logout();
                alert('Session expired. Please login again.');
                return;
            }

            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
                alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
            } else {
                const data = await res.json().catch(() => ({}));
                alert(data.message || 'Operation failed');
            }
        } catch (err) { console.error(err); }
    };

    // --- Order Status Handler ---
    const handleStatusUpdate = async (id, newStatus, message = '') => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/api/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus, message })
            });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/auth/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                fetchData();
            } else {
                alert('Failed to delete user');
            }
        } catch (err) { console.error(err); }
    };

    // --- Analytics Logic ---
    const analyticsData = useMemo(() => {
        const now = new Date();
        let startDate = new Date();
        let dateFormat = 'toLocaleDateString'; // Default grouping

        // Determine Start Date based on Range
        if (timeRange === 'daily') {
            startDate.setHours(0, 0, 0, 0); // Start of today
        } else if (timeRange === 'weekly') {
            startDate.setDate(now.getDate() - 6); // Last 7 days
            startDate.setHours(0, 0, 0, 0);
        } else if (timeRange === 'monthly') {
            startDate.setDate(now.getDate() - 29); // Last 30 days
            startDate.setHours(0, 0, 0, 0);
        } else if (timeRange === 'yearly') {
            startDate.setFullYear(now.getFullYear(), 0, 1); // Start of year
            dateFormat = 'month'; // Special flag for grouping by month
        } else {
            // All time: find earliest order or default to 30 days ago
            if (orders.length > 0) {
                const earliest = new Date(Math.min(...orders.map(o => new Date(o.createdAt))));
                startDate = earliest;
            } else {
                startDate.setDate(now.getDate() - 30);
            }
        }

        // Filter Orders (exclude cancelled from analytics)
        const nonCancelled = orders.filter(o => (o.status || '').toLowerCase() !== 'cancelled');
        const filteredOrders = nonCancelled.filter(order => new Date(order.createdAt) >= startDate);

        const revenue = filteredOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0).toLocaleString();
        const count = filteredOrders.length;

        // Group Data
        const groupedData = {};

        // Initialize all periods with 0 to show flat line for empty days
        let currentDate = new Date(startDate);
        const end = new Date();

        while (currentDate <= end) {
            let key;
            if (timeRange === 'daily') {
                // For daily, maybe group by hour? For now just show one point or simple grouping
                key = currentDate.toLocaleDateString();
            } else if (dateFormat === 'month') {
                key = currentDate.toLocaleString('default', { month: 'short' });
            } else {
                key = currentDate.toLocaleDateString();
            }
            if (!groupedData[key]) groupedData[key] = 0;

            // Advance
            if (dateFormat === 'month') {
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else {
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        // Fill with actual data
        filteredOrders.forEach(o => {
            const date = new Date(o.createdAt);
            let key;
            if (dateFormat === 'month') {
                key = date.toLocaleString('default', { month: 'short' });
            } else {
                key = date.toLocaleDateString();
            }
            if (groupedData[key] !== undefined) {
                groupedData[key] += parseFloat(o.totalAmount || 0);
            }
        });

        const chartPoints = Object.keys(groupedData).map(key => ({ date: key, val: groupedData[key] }));

        return { revenue, count, orders: filteredOrders, chartPoints };
    }, [orders, timeRange]);

    // Admin Order Map Component
    const AdminOrderMap = ({ orderId, coordinates }) => {
        const mapRef = useRef(null);
        const [mapInitialized, setMapInitialized] = useState(false);

        useEffect(() => {
            if (!mapRef.current || mapInitialized || !coordinates) return;

            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            if (!apiKey) {
                console.warn('Google Maps API key missing for admin map');
                return;
            }

            const initMap = () => {
                if (!window.google || !mapRef.current) return;

                const center = { lat: coordinates.lat, lng: coordinates.lng };
                const map = new window.google.maps.Map(mapRef.current, {
                    center,
                    zoom: 15,
                    mapTypeControl: true,
                    streetViewControl: true,
                });

                new window.google.maps.Marker({
                    map,
                    position: center,
                    title: 'Delivery Location',
                });

                setMapInitialized(true);
            };

            if (window.google && window.google.maps) {
                initMap();
            } else {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
                script.async = true;
                script.defer = true;
                script.onload = initMap;
                document.head.appendChild(script);
            }
        }, [orderId, coordinates, mapInitialized]);

        return (
            <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-lg">
                <h3 className="font-bold mb-3 dark:text-white">Delivery Location Map</h3>
                <div
                    ref={mapRef}
                    className="w-full h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                </p>
                <a
                    href={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-shein-red hover:underline mt-2 inline-block"
                >
                    Open in Google Maps →
                </a>
            </div>
        );
    };

    // Simple SVG Chart Component
    const Chart = ({ data }) => {
        if (!data || data.length === 0) return (
            <div className="w-full h-32 flex items-center justify-center text-gray-400 text-sm border-dashed border rounded">
                No data for this period
            </div>
        );

        const height = 100;
        const width = 300;
        const maxVal = Math.max(...data.map(d => d.val)) || 100; // Default max if all 0

        const points = data.map((d, i) => {
            const x = (i / (data.length - 1 || 1)) * width; // Avoid divide by 0
            const y = height - (d.val / maxVal) * height;
            return `${x},${y}`;
        }).join(' ');

        const areaPoints = `0,${height} ${points} ${width},${height}`;

        return (
            <div className="w-full h-32 relative group cursor-crosshair bg-white dark:bg-black/20 rounded-lg p-2 transition-colors">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible preserve-3d">
                    <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" className="text-black dark:text-shein-red" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-black dark:text-shein-red" />
                        </linearGradient>
                    </defs>
                    {/* Area */}
                    <polygon points={areaPoints} fill="url(#chartGrad)" opacity="0.1" />
                    {/* Line */}
                    <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" className="text-black dark:text-shein-red" />
                    {/* Points & Tooltips */}
                    {data.map((d, i) => {
                        const x = (i / (data.length - 1 || 1)) * width;
                        const y = height - (d.val / maxVal) * height;
                        return (
                            <g key={i} className="group/point">
                                <circle cx={x} cy={y} r="4" className="fill-black dark:fill-shein-red opacity-0 group-hover:opacity-100 transition duration-300" />
                                {/* Simple native tooltip using title */}
                                <title>{`${d.date}: ${d.val.toLocaleString()} RWF`}</title>
                            </g>
                        );
                    })}
                </svg>
                {/* Custom Hover Label logic could go here, but <title> is robust/simple for now */}
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] font-sans transition-colors">
            {/* Sidebar - Desktop & Mobile Drawer */}
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-black shadow-lg border-r dark:border-white/5 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center p-6 bg-white dark:bg-black">
                    <h1 className="text-xl font-black uppercase tracking-tighter dark:text-white">{t('adm_panel')}</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden dark:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="px-4 space-y-2 mt-4">
                    <button onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'overview' ? 'bg-black dark:bg-shein-red text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                        <LayoutDashboard className="w-5 h-5 mr-3" /> {t('adm_overview')}
                    </button>
                    <button onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'analytics' ? 'bg-black dark:bg-shein-red text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                        <BarChart className="w-5 h-5 mr-3" /> {t('adm_analytics')}
                    </button>
                    <button onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'products' ? 'bg-black dark:bg-shein-red text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                        <ShoppingBag className="w-5 h-5 mr-3" /> {t('adm_products')}
                    </button>
                    <button onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'orders' ? 'bg-black dark:bg-shein-red text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                        <Package className="w-5 h-5 mr-3" /> {t('adm_orders')}
                    </button>
                    <button onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'inventory' ? 'bg-black dark:bg-shein-red text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                        <BarChart className="w-5 h-5 mr-3" /> {t('adm_inventory')}
                    </button>
                    <button onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'users' ? 'bg-black dark:bg-shein-red text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                        <Users className="w-5 h-5 mr-3" /> {t('adm_users')}
                    </button>
                    <button onClick={() => { setActiveTab('messages'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'messages' ? 'bg-black dark:bg-shein-red text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                        <Mail className="w-5 h-5 mr-3" /> {t('adm_messages')}
                    </button>
                    <button onClick={logout} className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-8">
                        {t('adm_logout')}
                    </button>
                </nav>
            </aside>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="md:hidden mb-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 dark:text-white">
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold dark:text-white">Admin Panel</h1>
                    </div>
                    <button onClick={logout} className="text-red-500 font-bold">Logout</button>
                </div>

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold dark:text-white">{t('adm_overview')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{t('adm_total_rev')}</span>
                                <p className="text-3xl font-bold mt-2 dark:text-white">
                                    {orders
                                        .filter(o => (o.status || '').toLowerCase() !== 'cancelled')
                                        .reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0)
                                        .toLocaleString()} RWF
                                </p>
                            </div>
                            <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{t('adm_total_orders')}</span>
                                <p className="text-3xl font-bold mt-2 dark:text-white">{orders.length}</p>
                            </div>
                            <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{t('adm_total_products')}</span>
                                <p className="text-3xl font-bold mt-2 dark:text-white">{products.length}</p>
                            </div>
                            <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{t('adm_low_stock')}</span>
                                <p className="text-3xl font-bold mt-2 text-red-500">{products.filter(p => (p.stockQuantity || 0) < 5).length}</p>
                            </div>
                        </div>

                        {/* Quick Chart */}
                        <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 mt-8 transition-colors">
                            <h3 className="font-bold mb-4 dark:text-white">{t('adm_rev_trends')}</h3>
                            <Chart data={analyticsData.chartPoints} />
                        </div>
                    </div>
                )}

                {/* ANALYTICS TAB */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold dark:text-white">{t('adm_sales_analytics')}</h2>
                            <div className="bg-white dark:bg-black border dark:border-white/10 rounded-lg p-1 flex">
                                {['daily', 'weekly', 'monthly', 'yearly', 'all'].map(range => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition ${timeRange === range ? 'bg-black dark:bg-shein-red text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
                                <div className="text-center mb-6">
                                    <span className="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-500 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase">{timeRange} Revenue</span>
                                    <p className="text-5xl font-black mt-4 dark:text-white">{Number(analyticsData.revenue).toLocaleString()} RWF</p>
                                </div>
                                <Chart data={analyticsData.chartPoints} />
                            </div>

                            <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors flex flex-col items-center justify-center text-center">
                                <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-500 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase">{timeRange} Orders</span>
                                <span className="text-5xl font-black tracking-tight dark:text-white">{analyticsData.count}</span>
                                <span className="text-gray-400 dark:text-gray-500 text-sm mt-2">Total Transactions</span>
                            </div>
                        </div>

                        {/* AI Sentiment Analysis Section */}
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 p-8 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                                        <BarChart className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold dark:text-white">AI-Powered Sentiment Analysis</h3>
                                </div>
                                <button
                                    onClick={fetchSentiment}
                                    disabled={isSentimentLoading}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
                                >
                                    {isSentimentLoading ? 'Analyzing...' : 'Refresh AI Insights'}
                                </button>
                            </div>

                            {!shopSentiment && !isSentimentLoading ? (
                                <div className="text-center py-10">
                                    <p className="text-gray-500 dark:text-gray-400 italic">Click the button to generate AI insights from recent reviews.</p>
                                </div>
                            ) : isSentimentLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-4 bg-indigo-200 dark:bg-indigo-900/40 rounded w-full"></div>
                                    <div className="h-4 bg-indigo-200 dark:bg-indigo-900/40 rounded w-5/6"></div>
                                    <div className="h-4 bg-indigo-200 dark:bg-indigo-900/40 rounded w-4/5"></div>
                                </div>
                            ) : (
                                <div className="prose prose-indigo dark:prose-invert max-w-none">
                                    <div className="bg-white/50 dark:bg-black/20 p-6 rounded-xl border border-white dark:border-white/5 shadow-inner">
                                        <p className="whitespace-pre-line text-indigo-900 dark:text-indigo-300 leading-relaxed italic">
                                            {shopSentiment}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {activeTab === 'products' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold dark:text-white">{t('adm_products')}</h2>
                            <button
                                onClick={() => handleOpenModal()}
                                className="bg-black dark:bg-shein-red text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-red-600 transition-colors"
                            >
                                <Plus size={20} /> {t('adm_add_product')}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map(product => (
                                <div key={product.id} className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:shadow-md transition group">
                                    <div className="relative">
                                        <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <button onClick={() => handleOpenModal(product)} className="bg-white dark:bg-black p-2 rounded-full shadow-md text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="bg-white dark:bg-black p-2 rounded-full shadow-md text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold truncate dark:text-white">{product.title}</h3>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{Number(product.price).toLocaleString()} RWF</p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${(product.stockQuantity || 0) <= 0 ? 'bg-red-100 text-red-600 dark:bg-red-500/20' :
                                            (product.stockQuantity || 0) < 5 ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20' :
                                                'bg-green-100 text-green-600 dark:bg-green-500/20'
                                            }`}>
                                            {(product.stockQuantity || 0) <= 0 ? 'Out of Stock' :
                                                (product.stockQuantity || 0) < 5 ? `Low Stock (${product.stockQuantity})` :
                                                    `Stock: ${product.stockQuantity}`}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* INVENTORY TAB */}
                {activeTab === 'inventory' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold dark:text-white">{t('adm_inventory_mgmt')}</h2>
                            <div className="flex gap-2">
                                {['all', 'low', 'out'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setInventoryFilter(f)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold uppercase transition ${inventoryFilter === f ? 'bg-black dark:bg-shein-red text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}
                                    >
                                        {f === 'low' ? t('prod_low_stock') : f === 'out' ? t('prod_out_of_stock') : t('adm_all_items')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-colors">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-black/40 border-b border-gray-100 dark:border-white/5">
                                    <tr className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-tighter">
                                        <th className="p-4">Product</th>
                                        <th className="p-4 text-center">Base Stock</th>
                                        <th className="p-4">Variants Log</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.filter(p => {
                                        if (inventoryFilter === 'low') return (p.stockQuantity || 0) < 5 && (p.stockQuantity || 0) > 0;
                                        if (inventoryFilter === 'out') return (p.stockQuantity || 0) <= 0;
                                        return true;
                                    }).map(p => (
                                        <tr key={p.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                                            <td className="p-4 font-mono text-xs dark:text-gray-400">#{p.id}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={p.image} className="w-10 h-10 rounded object-cover" alt="" />
                                                    <div>
                                                        <p className="font-bold text-sm dark:text-white">{p.title}</p>
                                                        <p className="text-xs text-gray-500">{p.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center dark:text-white font-mono">{p.stockQuantity || 0}</td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {p.variants?.map((v, i) => (
                                                        <span key={i} className="text-[10px] bg-gray-100 dark:bg-white/10 dark:text-gray-400 px-1.5 py-0.5 rounded">
                                                            {v.size}/{v.color}: {v.stock}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${(p.stockQuantity || 0) <= 0 ? 'bg-red-100 text-red-600 dark:bg-red-500/20' :
                                                    (p.stockQuantity || 0) < 5 ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20' :
                                                        'bg-green-100 text-green-600 dark:bg-green-500/20'
                                                    }`}>
                                                    {(p.stockQuantity || 0) <= 0 ? 'Out of Stock' : (p.stockQuantity || 0) < 5 ? 'Low' : 'OK'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(p)}
                                                        className="text-blue-500 hover:text-blue-700 p-1"
                                                        title="Edit product"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStock(p.id, 0)}
                                                        className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                                                        title="Mark out of stock"
                                                    >
                                                        Mark Out
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStock(p.id, (p.stockQuantity || 0) + 10)}
                                                        className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400"
                                                        title="Add 10 to stock"
                                                    >
                                                        +10
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ORDERS TAB (RESTORED) */}
                {activeTab === 'orders' && (
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h2 className="text-2xl font-bold dark:text-white">{t('adm_orders')}</h2>
                            <div className="flex gap-4 w-full md:w-auto">
                                <input
                                    placeholder="Search Order ID..."
                                    className="border dark:border-white/10 bg-white dark:bg-black/20 dark:text-white p-2 rounded flex-1 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                                    value={orderSearch}
                                    onChange={(e) => setOrderSearch(e.target.value)}
                                />
                                <select
                                    className="border dark:border-white/10 bg-white dark:bg-black dark:text-white p-2 rounded outline-none"
                                    value={orderFilter}
                                    onChange={(e) => setOrderFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-colors">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-black/40 border-b border-gray-100 dark:border-white/5">
                                    <tr className="dark:text-gray-300">
                                        <th className="p-4 font-semibold text-sm">ID</th>
                                        <th className="p-4 font-semibold text-sm">{t('adm_order_id')}</th>
                                        <th className="p-4 font-semibold text-sm">{t('adm_date')}</th>
                                        <th className="p-4 font-semibold text-sm">{t('adm_customer')}</th>
                                        <th className="p-4 font-semibold text-sm">{t('cart_total')}</th>
                                        <th className="p-4 font-semibold text-sm">{t('cart_status')}</th>
                                        <th className="p-4 font-semibold text-sm">{t('adm_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.filter(order => {
                                        const matchesStatus = orderFilter === 'all' || order.status === orderFilter;
                                        const matchesSearch = order.id.toString().includes(orderSearch);
                                        return matchesStatus && matchesSearch;
                                    }).map(order => (
                                        <tr key={order.id} className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                                            <td className="p-4 font-mono text-sm dark:text-gray-400">#{order.id}</td>
                                            <td className="p-4 text-sm dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4 text-sm dark:text-gray-400">User ID: {order.UserId || 'Guest'}</td>
                                            <td className="p-4 font-bold text-sm dark:text-white">
                                                {Number(order.totalAmount).toLocaleString()} RWF
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize 
                                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500' :
                                                        order.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-500' : 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => {
                                                            const msg = window.prompt(`Enter message for ${e.target.value} status (optional):`);
                                                            handleStatusUpdate(order.id, e.target.value, msg);
                                                        }}
                                                        className="border dark:border-white/10 bg-white dark:bg-black dark:text-white rounded px-2 py-1 text-xs outline-none"
                                                    >
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                    </select>
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="text-xs bg-gray-100 dark:bg-white/10 hover:bg-black dark:hover:bg-shein-red hover:text-white px-2 py-1 rounded transition dark:text-gray-300"
                                                    >
                                                        {t('adm_view_items')}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* USERS TAB (RESTORED) */}
                {activeTab === 'users' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 dark:text-white">{t('adm_users')} ({users.length})</h2>
                        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-colors">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-black/40 border-b border-gray-100 dark:border-white/5">
                                    <tr className="dark:text-gray-300">
                                        <th className="p-4 font-semibold text-sm">ID</th>
                                        <th className="p-4 font-semibold text-sm">Name</th>
                                        <th className="p-4 font-semibold text-sm">Email</th>
                                        <th className="p-4 font-semibold text-sm">Role</th>
                                        <th className="p-4 font-semibold text-sm">Joined</th>
                                        <th className="p-4 font-semibold text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                                            <td className="p-4 text-sm font-mono dark:text-gray-400">{u.id}</td>
                                            <td className="p-4 text-sm font-medium dark:text-white">{u.name}</td>
                                            <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm dark:text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                {u.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* MESSAGES TAB */}
                {activeTab === 'messages' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 dark:text-white">{t('adm_messages_count')} ({messages.length})</h2>
                        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-colors">
                            <div className="divide-y divide-gray-100 dark:divide-white/5">
                                {messages.map(msg => (
                                    <div key={msg.id} className="p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg dark:text-white">{msg.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{msg.email}</p>
                                            </div>
                                            <span className="text-xs text-gray-400 dark:text-gray-600">{new Date(msg.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-black/40 p-4 rounded-lg">{msg.message}</p>
                                        <button className="text-sm font-bold mt-2 text-shein-red hover:underline transition-colors">
                                            {t('adm_reply')} (mailto)
                                        </button>
                                    </div>
                                ))}
                                {messages.length === 0 && (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">{t('adm_no_messages')}</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 transition-colors">
                        <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border dark:border-white/10">
                            <div className="flex justify-between mb-4">
                                <h2 className="text-xl font-bold dark:text-white">{editingProduct ? t('adm_edit_prod') : t('adm_new_prod')}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="dark:text-white"><X /></button>
                            </div>
                            <form onSubmit={handleSubmitProduct} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1 dark:text-white">Product Name</label>
                                    <input className="w-full border dark:border-white/10 bg-white dark:bg-black dark:text-white p-3 rounded outline-none focus:ring-1 focus:ring-black dark:focus:ring-white" placeholder="Product Name" required value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-1 dark:text-white">Price (RWF)</label>
                                    <input type="number" className="w-full border dark:border-white/10 bg-white dark:bg-black dark:text-white p-3 rounded outline-none focus:ring-1 focus:ring-black dark:focus:ring-white" placeholder="Price" required value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-1 dark:text-white">Description</label>
                                    <textarea className="w-full border dark:border-white/10 bg-white dark:bg-black dark:text-white p-3 rounded outline-none focus:ring-1 focus:ring-black dark:focus:ring-white min-h-[100px]" placeholder="Description" required value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
                                </div>

                                <div className="pt-4 border-t dark:border-white/10 text-left">
                                    <p className="text-xs font-bold mb-1 dark:text-gray-300">Product Image</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setProductForm({ ...productForm, image: e.target.files[0] })}
                                        className="text-sm dark:text-gray-400 block w-full"
                                        required={!editingProduct}
                                    />
                                </div>

                                <button type="submit" className="w-full bg-black dark:bg-shein-red text-white py-4 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-red-600 transition-colors shadow-lg">
                                    {editingProduct ? t('adm_update_prod') : t('adm_create_prod')}
                                </button>
                            </form>
                        </div>
                    </div >
                )
            }

            {/* Order Details Modal */}
            {
                selectedOrder && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 transition-colors overflow-y-auto">
                        <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border dark:border-white/10 my-8">
                            <div className="flex justify-between items-start mb-6 border-b dark:border-white/10 pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold dark:text-white">Order #{selectedOrder.id}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                    <div className="mt-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize 
                                        ${selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500' :
                                                selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-500' : 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400'}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>

                                    <div className="mt-3">
                                        <button
                                            onClick={() => handleShareLocation(selectedOrder.id)}
                                            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-blue-700 transition"
                                        >
                                            <MapPin className="w-3 h-3" /> Share Current Location
                                        </button>
                                        {selectedOrder.currentLocation && (
                                            <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Location Shared
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors dark:text-white"><X className="w-6 h-6" /></button>
                            </div>

                            <div className="space-y-6">
                                {/* Customer & Shipping Info */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-lg">
                                        <h3 className="font-bold mb-3 dark:text-white flex items-center gap-2">
                                            <Users className="w-4 h-4" /> Customer Information
                                        </h3>
                                        <p className="text-sm dark:text-gray-300">
                                            <span className="font-bold">Name:</span> {selectedOrder.shippingAddress?.name || 'N/A'}
                                        </p>
                                        {selectedOrder.shippingAddress?.phone && (
                                            <p className="text-sm dark:text-gray-300 mt-2 flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                <span className="font-bold">Phone:</span>
                                                <a href={`tel:${selectedOrder.shippingAddress.phone}`} className="text-shein-red hover:underline">
                                                    {selectedOrder.shippingAddress.phone}
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                    <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-lg">
                                        <h3 className="font-bold mb-3 dark:text-white flex items-center gap-2">
                                            <MapPin className="w-4 h-4" /> Delivery Address
                                        </h3>
                                        <p className="text-sm dark:text-gray-300">
                                            {selectedOrder.shippingAddress?.address || 'N/A'}
                                        </p>
                                        {selectedOrder.shippingAddress?.city && (
                                            <p className="text-sm dark:text-gray-300 mt-1">
                                                {selectedOrder.shippingAddress.city}
                                            </p>
                                        )}
                                        {selectedOrder.shippingAddress?.notes && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                                                Notes: {selectedOrder.shippingAddress.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Map for Delivery Location */}
                                {selectedOrder.shippingAddress?.coordinates && (
                                    <AdminOrderMap
                                        orderId={selectedOrder.id}
                                        coordinates={selectedOrder.shippingAddress.coordinates}
                                    />
                                )}

                                <div>
                                    <h3 className="font-bold mb-3 dark:text-white">Items ({selectedOrder.items?.length || 0})</h3>
                                    <div className="space-y-4">
                                        {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 border-b dark:border-white/5 pb-4 last:border-0">
                                                <div className="w-20 h-24 bg-gray-100 dark:bg-black rounded overflow-hidden flex-shrink-0">
                                                    <img src={item.image || "https://placehold.co/100x120?text=No+Img"} alt={item.title} className="w-full h-full object-cover dark:opacity-80" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold dark:text-white">{item.title}</h4>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        <p>Size: <span className="font-bold text-black dark:text-white">{item.size}</span></p>
                                                        <p>Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold dark:text-white">{Number(item.price).toLocaleString()} RWF</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Detailed Tracking History */}
                                {selectedOrder.trackingInfo && selectedOrder.trackingInfo.length > 0 && (
                                    <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-lg">
                                        <h3 className="font-bold mb-4 dark:text-white text-sm">Tracking History</h3>
                                        <div className="space-y-4 border-l-2 border-gray-200 dark:border-white/10 ml-2 pl-4">
                                            {[...selectedOrder.trackingInfo].reverse().map((info, i) => (
                                                <div key={i} className="relative">
                                                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-shein-red"></div>
                                                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-tighter">
                                                        {new Date(info.time).toLocaleString()}
                                                    </p>
                                                    <p className="font-bold text-xs dark:text-white">{info.status}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{info.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="bg-gray-50 dark:bg-black/40 p-6 rounded-lg flex justify-between items-center transition-colors border-t border-gray-100 dark:border-white/5">
                                    <span className="font-bold text-lg dark:text-gray-200">Total Amount</span>
                                    <span className="font-black text-2xl dark:text-white">{Number(selectedOrder.totalAmount).toLocaleString()} RWF</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AdminDashboard;

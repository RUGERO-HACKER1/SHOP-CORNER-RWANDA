
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Upload, X, Package, Users, ShoppingBag, LayoutDashboard, DollarSign, Edit, BarChart, Mail, Menu } from 'lucide-react';
import { API_URL } from '../config';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Tabs
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        category: 'Dresses', sizes: '', image: null
    });

    // Order Detail Modal
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderFilter, setOrderFilter] = useState('all');
    const [orderSearch, setOrderSearch] = useState('');

    // Analytics State
    const [timeRange, setTimeRange] = useState('all');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [resProd, resOrd, resUsers, resMsgs] = await Promise.all([
                fetch(`${API_URL}/api/products`),
                fetch(`${API_URL}/api/orders`, { headers }),
                fetch(`${API_URL}/api/auth`, { headers }),
                fetch(`${API_URL}/api/contact`, { headers })
            ]);

            setProducts(await resProd.json());
            const ordersData = await resOrd.json();
            setOrders(Array.isArray(ordersData) ? ordersData : []);
            const usersData = await resUsers.json();
            setUsers(Array.isArray(usersData) ? usersData : []);
            const msgsData = await resMsgs.json();
            setMessages(Array.isArray(msgsData) ? msgsData : []);
        } catch (err) { console.error('Data fetch failed', err); }
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

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setProductForm({
                title: product.title,
                description: product.description,
                price: product.price,
                originalPrice: product.originalPrice || '',
                category: product.category,
                sizes: Array.isArray(product.sizes) ? product.sizes.join(',') : product.sizes,
                image: null // Start null, specific logic to keep old if null sent
            });
        } else {
            setEditingProduct(null);
            setProductForm({
                title: '', description: '', price: '', originalPrice: '',
                category: 'Dresses', sizes: '', image: null
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(productForm).forEach(key => {
                if (productForm[key] !== null) formData.append(key, productForm[key]);
            });
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

            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                alert('Operation failed');
            }
        } catch (err) { console.error(err); }
    };

    // --- Order Status Handler ---
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/api/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
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

        // Filter Orders
        const filteredOrders = orders.filter(order => new Date(order.createdAt) >= startDate);

        const revenue = filteredOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0).toFixed(2);
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
            <div className="w-full h-32 relative group cursor-crosshair bg-white">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible preserve-3d">
                    <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="black" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {/* Area */}
                    <polygon points={areaPoints} fill="url(#chartGrad)" opacity="0.2" />
                    {/* Line */}
                    <polyline points={points} fill="none" stroke="black" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    {/* Points & Tooltips */}
                    {data.map((d, i) => {
                        const x = (i / (data.length - 1 || 1)) * width;
                        const y = height - (d.val / maxVal) * height;
                        return (
                            <g key={i} className="group/point">
                                <circle cx={x} cy={y} r="4" className="fill-black opacity-0 group-hover:opacity-100 transition duration-300" />
                                {/* Simple native tooltip using title */}
                                <title>{`${d.date}: $${d.val.toFixed(2)}`}</title>
                            </g>
                        );
                    })}
                </svg>
                {/* Custom Hover Label logic could go here, but <title> is robust/simple for now */}
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar - Desktop & Mobile Drawer */}
            <aside className={`fixed inset-y-0 left-0 bg-white shadow-lg border-r z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center p-6">
                    <h1 className="text-xl font-black uppercase tracking-tighter">Admin Panel</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="px-4 space-y-2">
                    <button onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'overview' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <LayoutDashboard className="w-5 h-5 mr-3" /> Overview
                    </button>
                    <button onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'analytics' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <BarChart className="w-5 h-5 mr-3" /> Analytics
                    </button>
                    <button onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'products' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <ShoppingBag className="w-5 h-5 mr-3" /> Products
                    </button>
                    <button onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'orders' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <Package className="w-5 h-5 mr-3" /> Orders
                    </button>
                    <button onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'users' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <Users className="w-5 h-5 mr-3" /> Users
                    </button>
                    <button onClick={() => { setActiveTab('messages'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'messages' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <Mail className="w-5 h-5 mr-3" /> Messages
                    </button>
                    <button onClick={logout} className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-8">
                        Logout
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
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2">
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold">Admin Panel</h1>
                    </div>
                    <button onClick={logout} className="text-red-500">Logout</button>
                </div>

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <span className="text-gray-500 text-sm">Total Revenue</span>
                                <p className="text-3xl font-bold mt-2">${orders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0).toFixed(2)}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <span className="text-gray-500 text-sm">Total Orders</span>
                                <p className="text-3xl font-bold mt-2">{orders.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <span className="text-gray-500 text-sm">Total Products</span>
                                <p className="text-3xl font-bold mt-2">{products.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <span className="text-gray-500 text-sm">New Messages</span>
                                <p className="text-3xl font-bold mt-2">{messages.length}</p>
                            </div>
                        </div>

                        {/* Quick Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
                            <h3 className="font-bold mb-4">Revenue Trends</h3>
                            <Chart data={analyticsData.chartPoints} />
                        </div>
                    </div>
                )}

                {/* ANALYTICS TAB */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Sales Analytics</h2>
                            <div className="bg-white border rounded-lg p-1 flex">
                                {['daily', 'weekly', 'monthly', 'yearly', 'all'].map(range => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition ${timeRange === range ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <div className="text-center mb-6">
                                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase">{timeRange} Revenue</span>
                                    <p className="text-5xl font-black mt-4">${analyticsData.revenue}</p>
                                </div>
                                <Chart data={analyticsData.chartPoints} />
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase">{timeRange} Orders</span>
                                <span className="text-5xl font-black tracking-tight">{analyticsData.count}</span>
                                <span className="text-gray-400 text-sm mt-2">Total Transactions</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {activeTab === 'products' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Products</h2>
                            <button
                                onClick={() => handleOpenModal()}
                                className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
                            >
                                <Plus size={20} /> Add Product
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map(product => (
                                <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition group">
                                    <div className="relative">
                                        <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <button onClick={() => handleOpenModal(product)} className="bg-white p-2 rounded-full shadow-md text-blue-600 hover:text-blue-800">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="bg-white p-2 rounded-full shadow-md text-red-600 hover:text-red-800">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold truncate">{product.title}</h3>
                                    <p className="text-sm font-medium text-gray-500">${product.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ORDERS TAB (RESTORED) */}
                {activeTab === 'orders' && (
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h2 className="text-2xl font-bold">Orders</h2>
                            <div className="flex gap-4 w-full md:w-auto">
                                <input
                                    placeholder="Search Order ID..."
                                    className="border p-2 rounded flex-1"
                                    value={orderSearch}
                                    onChange={(e) => setOrderSearch(e.target.value)}
                                />
                                <select
                                    className="border p-2 rounded"
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 font-semibold text-sm">Order ID</th>
                                        <th className="p-4 font-semibold text-sm">Date</th>
                                        <th className="p-4 font-semibold text-sm">Customer</th>
                                        <th className="p-4 font-semibold text-sm">Total</th>
                                        <th className="p-4 font-semibold text-sm">Status</th>
                                        <th className="p-4 font-semibold text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.filter(order => {
                                        const matchesStatus = orderFilter === 'all' || order.status === orderFilter;
                                        const matchesSearch = order.id.toString().includes(orderSearch);
                                        return matchesStatus && matchesSearch;
                                    }).map(order => (
                                        <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                                            <td className="p-4 font-mono text-sm">#{order.id}</td>
                                            <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4 text-sm">User ID: {order.UserId || 'Guest'}</td>
                                            <td className="p-4 font-bold text-sm">
                                                ${parseFloat(order.totalAmount).toFixed(2)}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize 
                                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                        className="border rounded px-2 py-1 text-xs"
                                                    >
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                    </select>
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="text-xs bg-gray-100 hover:bg-black hover:text-white px-2 py-1 rounded transition"
                                                    >
                                                        View Items
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
                        <h2 className="text-2xl font-bold mb-6">Users ({users.length})</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
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
                                        <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="p-4 text-sm font-mono">{u.id}</td>
                                            <td className="p-4 text-sm font-medium">{u.name}</td>
                                            <td className="p-4 text-sm text-gray-500">{u.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
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
                        <h2 className="text-2xl font-bold mb-6">Contact Messages ({messages.length})</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="divide-y divide-gray-100">
                                {messages.map(msg => (
                                    <div key={msg.id} className="p-6 hover:bg-gray-50 transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg">{msg.name}</h3>
                                                <p className="text-sm text-gray-500">{msg.email}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-gray-700 mt-2 bg-gray-50 p-4 rounded-lg">{msg.message}</p>
                                        <button className="text-sm font-bold mt-2 text-blue-600 hover:underline">
                                            Reply (mailto)
                                        </button>
                                    </div>
                                ))}
                                {messages.length === 0 && (
                                    <div className="p-8 text-center text-gray-500">No messages yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between mb-4">
                                <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
                                <button onClick={() => setIsModalOpen(false)}><X /></button>
                            </div>
                            <form onSubmit={handleSubmitProduct} className="space-y-4">
                                <input className="w-full border p-2 rounded" placeholder="Title" required value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} />
                                <textarea className="w-full border p-2 rounded" placeholder="Description" required value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" className="w-full border p-2 rounded" placeholder="Price" required value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                                    <input type="number" className="w-full border p-2 rounded" placeholder="Original Price" value={productForm.originalPrice} onChange={e => setProductForm({ ...productForm, originalPrice: e.target.value })} />
                                </div>
                                <input className="w-full border p-2 rounded" placeholder="Sizes (e.g. S,M,L)" required value={productForm.sizes} onChange={e => setProductForm({ ...productForm, sizes: e.target.value })} />
                                <div className="border border-dashed p-4 text-center rounded">
                                    <p className="text-xs text-gray-500 mb-2">Leave empty to keep existing image</p>
                                    <input type="file" accept="image/*" onChange={e => setProductForm({ ...productForm, image: e.target.files[0] })} />
                                </div>
                                <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800">
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Order Details Modal */}
            {
                selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-start mb-6 border-b pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold">Order #{selectedOrder.id}</h2>
                                    <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                    <div className="mt-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize 
                                        ${selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold mb-3">Items ({selectedOrder.items?.length || 0})</h3>
                                    <div className="space-y-4">
                                        {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 border-b pb-4 last:border-0">
                                                <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                    {/* Use product image if available in item structure, else placeholder */}
                                                    <img src={item.image || "https://placehold.co/100x120?text=No+Img"} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold">{item.title}</h4>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        <p>Size: <span className="font-bold text-black">{item.size}</span></p>
                                                        <p>Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">${item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                                    <span className="font-bold text-lg">Total Amount</span>
                                    <span className="font-black text-2xl">${parseFloat(selectedOrder.totalAmount).toFixed(2)}</span>
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

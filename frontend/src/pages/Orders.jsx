import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, ChevronRight, X, MapPin, Phone, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { API_URL } from '../config';
import { useLanguage } from '../context/LanguageContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const invoiceMapRef = useRef(null);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();

    useEffect(() => {
        const token = localStorage.getItem('token');
        // In a real app, we'd use the user ID or token to fetch specific orders
        fetch(`${API_URL}/api/orders/myorders`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching orders:", err);
                setLoading(false);
            });
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'processing': return 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20';
            case 'delivered': return 'text-green-600 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';
            case 'cancelled': return 'text-red-600 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
            default: return 'text-gray-600 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return <CheckCircle className="w-4 h-4" />;
            case 'processing': return <Clock className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    const handleCancelOrder = async (orderId) => {
        const confirm = window.confirm('Are you sure you want to cancel this order?');
        if (!confirm) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || 'Failed to cancel order.');
                return;
            }
            // Refresh list locally
            setOrders(prev => prev.map(o => o.id === data.id ? data : o));
        } catch (err) {
            console.error('Error cancelling order:', err);
            alert('Error cancelling order. Please try again.');
        }
    };

    // Load Google Maps for invoice modal
    useEffect(() => {
        if (!selectedOrder || !selectedOrder.shippingAddress?.coordinates) return;

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey || !invoiceMapRef.current) return;

        if (window.google && window.google.maps) {
            initInvoiceMap();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            setMapLoaded(true);
            setTimeout(() => initInvoiceMap(), 100);
        };
        document.head.appendChild(script);
    }, [selectedOrder]);

    const initInvoiceMap = () => {
        if (!invoiceMapRef.current || !window.google || !selectedOrder?.shippingAddress?.coordinates) return;

        const coords = selectedOrder.shippingAddress.coordinates;
        const center = { lat: coords.lat, lng: coords.lng };

        const map = new window.google.maps.Map(invoiceMapRef.current, {
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
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen dark:bg-[#0a0a0a]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl dark:bg-[#0a0a0a] min-h-screen transition-colors">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
                    <Package className="w-6 h-6" /> {t('nav_orders')}
                </h1>
                {user && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Logged in as <span className="font-bold dark:text-white">{user.name}</span>
                    </p>
                )}
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10">
                    <Package className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{t('ord_no_orders')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">{t('cart_looks_like')}</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-black dark:bg-shein-red text-white px-6 py-3 rounded-md hover:bg-gray-800 dark:hover:bg-red-600 transition font-bold"
                    >
                        {t('cta_start_shopping')}
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-white/5 overflow-hidden hover:shadow-md transition">
                            {/* Header */}
                            <div className="bg-gray-50 dark:bg-black/20 px-6 py-4 border-b border-gray-100 dark:border-white/5 flex flex-wrap gap-4 justify-between items-center text-sm">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold mb-1">{t('ord_placed')}</p>
                                        <p className="font-medium dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold mb-1">{t('ord_total')}</p>
                                        <p className="font-medium dark:text-white">{Number(order.totalAmount).toLocaleString()} RWF</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold mb-1">{t('ord_number')}</p>
                                        <p className="font-medium dark:text-white">{order.id}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {t(`status_${order.status.toLowerCase()}`)}
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="px-6 py-6 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#1a1a1a]">
                                <div className="relative mb-8">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-white/10 -translate-y-1/2 rounded-full"></div>
                                    <div
                                        className="absolute top-1/2 left-0 h-1 bg-shein-red -translate-y-1/2 rounded-full transition-all duration-500"
                                        style={{
                                            width: order.status.toLowerCase() === 'delivered' ? '100%' :
                                                order.status.toLowerCase() === 'shipped' ? '75%' :
                                                    order.status.toLowerCase() === 'processing' ? '33%' : '10%'
                                        }}
                                    ></div>
                                    <div className="relative flex justify-between">
                                        {['Placed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                                            const isActive =
                                                (order.status.toLowerCase() === 'delivered') ||
                                                (order.status.toLowerCase() === 'shipped' && idx <= 2) ||
                                                (order.status.toLowerCase() === 'processing' && idx <= 1) ||
                                                (idx === 0);

                                            return (
                                                <div key={step} className="flex flex-col items-center gap-2">
                                                    <div className={`w-4 h-4 rounded-full border-2 z-10 box-content ${isActive ? 'bg-shein-red border-shein-red' : 'bg-white dark:bg-black border-gray-300 dark:border-white/10'}`}></div>
                                                    <span className={`text-xs font-bold ${isActive ? 'text-black dark:text-white' : 'text-gray-400'}`}>{step}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Tracking History Detail */}
                                {order.trackingInfo && order.trackingInfo.length > 0 && (
                                    <div className="mt-4 space-y-4 border-l-2 border-gray-100 dark:border-white/5 ml-2 pl-6">
                                        {[...order.trackingInfo].reverse().map((info, i) => (
                                            <div key={i} className="relative">
                                                <div className="absolute -left-[31px] top-1.5 w-2 h-2 rounded-full bg-shein-red"></div>
                                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                                                    {new Date(info.time).toLocaleString()}
                                                </p>
                                                <p className="font-bold text-sm dark:text-white">{t(`status_${info.status.toLowerCase()}`)}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{info.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Body */}
                            <div className="p-6 flex flex-col sm:flex-row gap-6 items-center">
                                <div className="flex -space-x-4 overflow-hidden py-2">
                                    {order.items && order.items.length > 0 ? (
                                        order.items.slice(0, 3).map((item, idx) => (
                                            <img
                                                key={idx}
                                                src={item.image || 'https://placehold.co/100x120?text=Item'}
                                                className="inline-block h-20 w-16 rounded ring-2 ring-white object-cover"
                                                alt={item.title}
                                            />
                                        ))
                                    ) : (
                                        <>
                                            <img src="https://placehold.co/100x120?text=Item+1" className="inline-block h-20 w-16 rounded ring-2 ring-white object-cover" alt="" />
                                            <img src="https://placehold.co/100x120?text=Item+2" className="inline-block h-20 w-16 rounded ring-2 ring-white object-cover" alt="" />
                                        </>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1 dark:text-white">{t('ord_details')}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                        {t('ord_ship_to')}: <span className="font-medium text-black dark:text-white">
                                            {order.shippingAddress?.name || user?.name || 'Customer'}
                                        </span>
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-500 text-xs">
                                        Standard Shipping • {t('ord_est_delivery')}: {new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    {order.status.toLowerCase() === 'processing' && (
                                        <button
                                            onClick={() => handleCancelOrder(order.id)}
                                            className="text-sm font-bold text-red-600 hover:text-red-700 border border-red-200 dark:border-red-500/40 px-3 py-1 rounded-full transition-colors bg-red-50 dark:bg-red-500/10"
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-shein-red hover:text-red-700 text-sm font-bold flex items-center transition-colors"
                                    >
                                        {t('ord_view_invoice')} <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Invoice/Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 transition-colors overflow-y-auto">
                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border dark:border-white/10 my-8">
                        <div className="flex justify-between items-start mb-6 border-b dark:border-white/10 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold dark:text-white">Order Invoice #{selectedOrder.id}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors dark:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Customer & Shipping Info */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-lg">
                                    <h3 className="font-bold mb-3 dark:text-white flex items-center gap-2">
                                        <User className="w-4 h-4" /> Customer Information
                                    </h3>
                                    <p className="text-sm dark:text-gray-300">
                                        <span className="font-bold">Name:</span> {selectedOrder.shippingAddress?.name || user?.name || 'N/A'}
                                    </p>
                                    {selectedOrder.shippingAddress?.phone && (
                                        <p className="text-sm dark:text-gray-300 mt-2 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            <span className="font-bold">Phone:</span> {selectedOrder.shippingAddress.phone}
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
                                <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-lg">
                                    <h3 className="font-bold mb-3 dark:text-white">Delivery Location Map</h3>
                                    <div
                                        ref={invoiceMapRef}
                                        className="w-full h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        Coordinates: {selectedOrder.shippingAddress.coordinates.lat.toFixed(6)}, {selectedOrder.shippingAddress.coordinates.lng.toFixed(6)}
                                    </p>
                                </div>
                            )}

                            {/* Order Items */}
                            <div>
                                <h3 className="font-bold mb-3 dark:text-white">Order Items ({selectedOrder.items?.length || 0})</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 border-b dark:border-white/5 pb-3">
                                                <img
                                                    src={item.image || 'https://placehold.co/100x120?text=No+Img'}
                                                    alt={item.title}
                                                    className="w-16 h-20 object-cover rounded dark:opacity-80"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-bold dark:text-white">{item.title}</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Size: {item.size} • Qty: {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold dark:text-white">
                                                        {Number(item.price * item.quantity).toLocaleString()} RWF
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">No items found</p>
                                    )}
                                </div>
                            </div>

                            {/* Order Status */}
                            <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-lg">
                                <h3 className="font-bold mb-2 dark:text-white">Order Status</h3>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(selectedOrder.status)}`}>
                                    {getStatusIcon(selectedOrder.status)}
                                    {selectedOrder.status}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-black dark:bg-shein-red text-white p-6 rounded-lg flex justify-between items-center">
                                <span className="font-bold text-lg">Total Amount</span>
                                <span className="font-black text-2xl">{Number(selectedOrder.totalAmount).toLocaleString()} RWF</span>
                            </div>

                            {/* Print Button */}
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => window.print()}
                                    className="px-6 py-2 bg-gray-200 dark:bg-white/10 text-black dark:text-white rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-white/20 transition"
                                >
                                    Print Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;

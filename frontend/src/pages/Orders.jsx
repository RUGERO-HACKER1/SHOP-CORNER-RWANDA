import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { API_URL } from '../config';
import { useLanguage } from '../context/LanguageContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen dark:bg-[#0a0a0a]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl dark:bg-[#0a0a0a] min-h-screen transition-colors">
            <h1 className="text-2xl font-bold mb-8 flex items-center gap-2 dark:text-white">
                <Package className="w-6 h-6" /> {t('nav_orders')}
            </h1>

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
                                    {/* Mock item images for the list view */}
                                    <img src="https://placehold.co/100x120?text=Item+1" className="inline-block h-20 w-16 rounded ring-2 ring-white object-cover" alt="" />
                                    <img src="https://placehold.co/100x120?text=Item+2" className="inline-block h-20 w-16 rounded ring-2 ring-white object-cover" alt="" />
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
                                <button className="text-shein-red hover:text-red-700 text-sm font-bold flex items-center transition-colors">
                                    {t('ord_view_invoice')} <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;

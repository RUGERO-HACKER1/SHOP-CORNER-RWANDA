import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { API_URL } from '../config';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

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
            case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
            case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
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
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Package className="w-6 h-6" /> My Orders
            </h1>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
                    <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition font-bold"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition">
                            {/* Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center text-sm">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-gray-500 uppercase text-xs font-bold mb-1">Order Placed</p>
                                        <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 uppercase text-xs font-bold mb-1">Total</p>
                                        <p className="font-medium">${Number(order.totalAmount).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 uppercase text-xs font-bold mb-1">Order #</p>
                                        <p className="font-medium">{order.id}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="px-6 py-6 border-b border-gray-100 bg-white">
                                <div className="relative">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
                                    <div
                                        className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-500"
                                        style={{
                                            width: order.status === 'delivered' ? '100%' :
                                                order.status === 'shipped' ? '75%' :
                                                    order.status === 'processing' ? '50%' : '15%'
                                        }}
                                    ></div>
                                    <div className="relative flex justify-between">
                                        {['Placed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                                            const isActive =
                                                (order.status === 'delivered') ||
                                                (order.status === 'shipped' && idx <= 2) ||
                                                (order.status === 'processing' && idx <= 1) ||
                                                (idx === 0);

                                            return (
                                                <div key={step} className="flex flex-col items-center gap-2">
                                                    <div className={`w-4 h-4 rounded-full border-2 z-10 box-content ${isActive ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}></div>
                                                    <span className={`text-xs font-bold ${isActive ? 'text-black' : 'text-gray-400'}`}>{step}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 flex flex-col sm:flex-row gap-6 items-center">
                                <div className="flex -space-x-4 overflow-hidden py-2">
                                    {/* Mock item images for the list view */}
                                    <img src="https://placehold.co/100x120?text=Item+1" className="inline-block h-20 w-16 rounded ring-2 ring-white object-cover" alt="" />
                                    <img src="https://placehold.co/100x120?text=Item+2" className="inline-block h-20 w-16 rounded ring-2 ring-white object-cover" alt="" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1">Order Details</h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        Shipment to: <span className="font-medium text-black">
                                            {order.shippingAddress?.name || user?.name || 'Customer'}
                                        </span>
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                        Standard Shipping • Estimated Delivery: {new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center">
                                    View Invoice <ChevronRight className="w-4 h-4" />
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

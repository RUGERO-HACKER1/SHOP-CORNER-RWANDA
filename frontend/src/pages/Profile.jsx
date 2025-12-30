import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { Package, Clock, MapPin, CreditCard, ChevronRight } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    // State
    const [activeTab, setActiveTab] = useState('orders');
    const [addressForm, setAddressForm] = useState({
        street: '', city: '', state: '', zip: '', phone: ''
    });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            // Fetch Orders
            fetch(`${API_URL}/api/orders/myorders`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
                .then(res => res.json())
                .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
                .catch(err => { console.error(err); setLoading(false); });

            // Fetch Profile (Address)
            fetch(`${API_URL}/api/auth/profile`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.address) setAddressForm(data.address);
                })
                .catch(err => console.error(err));
        }
    }, [user]);

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ address: addressForm })
            });
            if (res.ok) {
                alert('Address saved successfully!');
            } else {
                alert('Failed to save address');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving address');
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return <div className="p-8 text-center">Please log in to view your profile.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-1/4">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">{user.name}</h2>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full text-left px-4 py-2 rounded font-bold ${activeTab === 'orders' ? 'bg-gray-100' : 'hover:bg-gray-50 text-gray-600'}`}
                            >
                                <Package className="inline w-4 h-4 mr-2" /> My Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('address')}
                                className={`w-full text-left px-4 py-2 rounded font-bold ${activeTab === 'address' ? 'bg-gray-100' : 'hover:bg-gray-50 text-gray-600'}`}
                            >
                                <MapPin className="inline w-4 h-4 mr-2" /> My Address
                            </button>
                            <button onClick={logout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded mt-4">
                                Logout
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full md:w-3/4">
                    {activeTab === 'orders' ? (
                        <>
                            <h2 className="text-2xl font-bold mb-6">Order History</h2>
                            {loading ? (
                                <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                                            <div className="flex justify-between items-start mb-4 border-b pb-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                                                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize 
                                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-5 h-5 text-gray-400" />
                                                    <span className="font-medium">{order.items?.length || 0} Items</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-lg">${order.totalAmount}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                            <div className="bg-white p-6 rounded-lg border border-gray-200">
                                <form onSubmit={handleSaveAddress} className="space-y-4 max-w-lg">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Street Address</label>
                                        <input
                                            className="w-full border p-2 rounded"
                                            value={addressForm.street}
                                            onChange={e => setAddressForm({ ...addressForm, street: e.target.value })}
                                            placeholder="123 Kigali St"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-1">City</label>
                                            <input
                                                className="w-full border p-2 rounded"
                                                value={addressForm.city}
                                                onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                                                placeholder="Kigali"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Province / State</label>
                                            <input
                                                className="w-full border p-2 rounded"
                                                value={addressForm.state}
                                                onChange={e => setAddressForm({ ...addressForm, state: e.target.value })}
                                                placeholder="Kigali City"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Zip Code</label>
                                            <input
                                                className="w-full border p-2 rounded"
                                                value={addressForm.zip}
                                                onChange={e => setAddressForm({ ...addressForm, zip: e.target.value })}
                                                placeholder="00000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Phone Number</label>
                                            <input
                                                className="w-full border p-2 rounded"
                                                value={addressForm.phone}
                                                onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })}
                                                placeholder="+250 7..."
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Address'}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;

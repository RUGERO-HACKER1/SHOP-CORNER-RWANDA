import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../config';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';

const Checkout = () => {
    const { cartTotal, cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Simple form state
    const [formData, setFormData] = useState({
        name: user?.name || '',
        address: '',
        city: '',
        zip: '',
        card: '',
        expiry: '',
        cvc: ''
    });

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            items: cart,
            totalAmount: cartTotal,
            shippingAddress: formData
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                clearCart();
                navigate('/order-success');
            } else {
                console.error('Order failed');
            }
        } catch (error) {
            console.error('Error placing order:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Forms */}
                <div className="flex-1 space-y-8">
                    {/* Shipping Info */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-lg font-bold">
                            <Truck className="w-5 h-5 text-accent" />
                            <h2>Shipping Address</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder="John Doe" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder="123 Fashion St" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder="New York" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                                <input type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder="10001" />
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-lg font-bold">
                            <CreditCard className="w-5 h-5 text-accent" />
                            <h2>Payment Method</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                <input type="text" name="card" value={formData.card} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder="0000 0000 0000 0000" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                <input type="text" name="expiry" value={formData.expiry} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder="MM/YY" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                <input type="text" name="cvc" value={formData.cvc} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder="123" />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
                    >
                        {loading ? 'Processing...' : `PAY $${cartTotal.toFixed(2)}`}
                    </button>
                </div>

                {/* Mini Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                        <h3 className="font-bold mb-4">Your Order</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto mb-4 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                    <img src={item.image} alt="" className="w-16 h-20 object-cover rounded" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium truncate">{item.title}</h4>
                                        <p className="text-xs text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                                        <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

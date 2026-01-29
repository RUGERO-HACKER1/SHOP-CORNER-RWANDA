import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../config';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Checkout = () => {
    const { cartTotal, cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    // Simple form state
    const [formData, setFormData] = useState({
        name: user?.name || '',
        address: '',
        city: '',
        zip: '',
        phone: '',
        network: 'MTN', // MTN or AIRTEL
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

        try {
            if (!formData.phone || !formData.network) {
                console.error('Phone and network are required');
                setLoading(false);
                return;
            }

            // 1) Call backend to start mobile money payment (MTN / Airtel)
            const response = await fetch(`${API_URL}/api/payments/mobile-money`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: cartTotal,
                    phoneNumber: formData.phone,
                    network: formData.network,
                    customerName: formData.name,
                    customerEmail: user?.email,
                    // You can also send cart + address here if needed on backend
                    // items: cart,
                    // shippingAddress: formData,
                }),
            });

            if (!response.ok) {
                console.error('Failed to start mobile money payment');
                return;
            }

            const data = await response.json();

            console.log('Mobile money response:', data);
            // At this point the user should receive a prompt on their phone
            // to confirm the payment. You can improve UX by navigating to
            // a "waiting for payment" page.
            clearCart();
            navigate('/order-success');
        } catch (error) {
            console.error('Error starting payment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl lg:max-w-5xl mx-auto w-full px-3 sm:px-4 py-6 sm:py-8 dark:bg-[#0a0a0a] min-h-screen transition-colors">
            <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 dark:text-white">{t('check_title')}</h1>

            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                {/* Forms */}
                <div className="flex-1 space-y-8">
                    {/* Shipping Info */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-white/5 shadow-sm transition-colors">
                        <div className="flex items-center gap-2 mb-6 text-lg font-bold dark:text-white">
                            <Truck className="w-5 h-5 text-shein-red" />
                            <h2>{t('check_shipping_title')}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{t('check_full_name')}</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border dark:border-white/10 bg-white dark:bg-black/20 dark:text-white rounded px-3 py-2 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" required placeholder="John Doe" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{t('check_address')}</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border dark:border-white/10 bg-white dark:bg-black/20 dark:text-white rounded px-3 py-2 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" required placeholder="123 Fashion St" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{t('check_city')}</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border dark:border-white/10 bg-white dark:bg-black/20 dark:text-white rounded px-3 py-2 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" required placeholder="New York" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{t('check_zip')}</label>
                                <input type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full border dark:border-white/10 bg-white dark:bg-black/20 dark:text-white rounded px-3 py-2 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" required placeholder="10001" />
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-white/5 shadow-sm transition-colors">
                        <div className="flex items-center gap-2 mb-6 text-lg font-bold dark:text-white">
                            <CreditCard className="w-5 h-5 text-shein-red" />
                            <h2>{t('check_payment_title')}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Phone number (MTN/Airtel)</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border dark:border-white/10 bg-white dark:bg-black/20 dark:text-white rounded px-3 py-2 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                                    required
                                    placeholder="07XXXXXXXX"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Network</label>
                                <select
                                    name="network"
                                    value={formData.network}
                                    onChange={handleChange}
                                    className="w-full border dark:border-white/10 bg-white dark:bg-black/20 dark:text-white rounded px-3 py-2 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                                >
                                    <option value="MTN">MTN MoMo</option>
                                    <option value="AIRTEL">Airtel Money</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-black dark:bg-shein-red text-white font-bold py-3 sm:py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-red-600 transition disabled:bg-gray-400 dark:disabled:bg-white/10 shadow-lg"
                    >
                        {loading ? t('check_processing') : `${t('check_pay')} ${cartTotal.toLocaleString()} RWF`}
                    </button>
                </div>

                {/* Mini Summary */}
                <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
                    <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 sm:p-6 rounded-lg lg:sticky lg:top-24 border dark:border-white/5 transition-colors">
                        <h3 className="font-bold mb-4 dark:text-white">{t('check_your_order')}</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto mb-4 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                    <img src={item.image} alt="" className="w-16 h-20 object-cover rounded dark:opacity-80" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium truncate dark:text-gray-200">{item.title}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Size: {item.size} | Qty: {item.quantity}</p>
                                        <p className="text-sm font-bold dark:text-white">{(item.price * item.quantity).toLocaleString()} RWF</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 dark:border-white/10 pt-4 flex justify-between font-bold text-lg dark:text-white">
                            <span>{t('cart_total')}</span>
                            <span>{cartTotal.toLocaleString()} RWF</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

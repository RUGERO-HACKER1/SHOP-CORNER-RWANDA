import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const { t } = useLanguage();

    if (cart.length === 0) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 dark:bg-[#0a0a0a]">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">{t('cart_bag_empty')}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">{t('cart_looks_like')}</p>
                <Link to="/" className="bg-black dark:bg-shein-red text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 dark:hover:bg-red-600 transition shadow-lg">
                    {t('cta_start_shopping')}
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto w-full px-3 sm:px-4 py-6 sm:py-8 dark:bg-[#0a0a0a] min-h-screen transition-colors">
            <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 dark:text-white">
                {t('cart_title')} ({cart.length})
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="lg:w-2/3 space-y-4 md:space-y-6">
                    {cart.map((item) => (
                        <div
                            key={`${item.id}-${item.size}`}
                            className="flex flex-col sm:flex-row gap-4 border-b border-gray-100 dark:border-white/5 pb-4 md:pb-6"
                        >
                            <Link to={`/product/${item.id}`} className="w-full sm:w-24 h-40 sm:h-32 flex-shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover rounded dark:opacity-80"
                                />
                            </Link>

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <Link to={`/product/${item.id}`} className="font-medium dark:text-gray-200 hover:underline w-3/4 truncate">
                                        {item.title}
                                    </Link>
                                    <button
                                        onClick={() => removeFromCart(item.id, item.size)}
                                        className="text-gray-400 dark:text-gray-500 hover:text-red-500 transition"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('prod_size')}: {item.size}</p>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center border border-gray-300 dark:border-white/10 rounded px-3 py-1 dark:text-white">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                            className="p-1 disabled:opacity-50"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="mx-3 text-sm font-bold">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                            className="p-1"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="font-bold dark:text-white">{(item.price * item.quantity).toLocaleString()} RWF</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={clearCart}
                        className="text-sm text-red-500 underline hover:no-underline"
                    >
                        {t('cart_clear')}
                    </button>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-lg sticky top-24 border dark:border-white/5 transition-colors">
                        <h2 className="text-lg font-bold mb-6 dark:text-white">{t('check_summary')}</h2>

                        <div className="space-y-4 text-sm mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">{t('cart_subtotal')}</span>
                                <span className="font-medium dark:text-white">{cartTotal.toLocaleString()} RWF</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">{t('cart_shipping')}</span>
                                <span className="text-green-600 dark:text-green-500 font-medium">{t('cart_free')}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold pt-4 border-t border-gray-200 dark:border-white/10 dark:text-white">
                                <span>{t('cart_total')}</span>
                                <span>{cartTotal.toLocaleString()} RWF</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-black dark:bg-shein-red text-white font-bold py-3 rounded hover:bg-gray-800 dark:hover:bg-red-600 transition flex items-center justify-center shadow-lg"
                            >
                                {t('cart_checkout')} <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                            <div className="text-center">
                                <span className="text-xs text-gray-500">{t('cart_secure')}</span>
                            </div>
                        </div>

                        {/* Payment Icons Mockup */}
                        <div className="flex justify-center gap-2 mt-6 opacity-50">
                            <div className="w-10 h-6 bg-gray-300 rounded" title="Visa"></div>
                            <div className="w-10 h-6 bg-gray-300 rounded" title="Mastercard"></div>
                            <div className="w-10 h-6 bg-gray-300 rounded" title="PayPal"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

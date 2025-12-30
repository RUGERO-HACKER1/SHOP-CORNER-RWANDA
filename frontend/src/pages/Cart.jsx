import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl font-bold mb-4">Your Bag is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything to your bag yet.</p>
                <Link to="/" className="bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition">
                    START SHOPPING
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Shopping Bag ({cart.length})</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="lg:w-2/3 space-y-6">
                    {cart.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-gray-100 pb-6">
                            <Link to={`/product/${item.id}`} className="w-24 h-32 flex-shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded" />
                            </Link>

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <Link to={`/product/${item.id}`} className="font-medium hover:underline w-3/4 truncate">
                                        {item.title}
                                    </Link>
                                    <button
                                        onClick={() => removeFromCart(item.id, item.size)}
                                        className="text-gray-400 hover:text-red-500 transition"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <p className="text-sm text-gray-500 mb-4">Size: {item.size}</p>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center border border-gray-300 rounded px-3 py-1">
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
                                    <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={clearCart}
                        className="text-sm text-red-500 underline hover:no-underline"
                    >
                        Clear Shopping Bag
                    </button>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                        <h2 className="text-lg font-bold mb-6">Order Summary</h2>

                        <div className="space-y-4 text-sm mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-base font-bold pt-4 border-t border-gray-200">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 transition flex items-center justify-center"
                            >
                                CHECKOUT NOW <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                            <div className="text-center">
                                <span className="text-xs text-gray-500">Secure Checkout - 100% Satisfaction Guarantee</span>
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

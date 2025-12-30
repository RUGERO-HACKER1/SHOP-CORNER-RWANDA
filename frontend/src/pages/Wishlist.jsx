import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-gray-50">
                <Heart className="w-16 h-16 text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
                <p className="text-gray-500 mb-8">Save items you love to revisit later.</p>
                <Link to="/" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-black uppercase tracking-tighter mb-8">My Wishlist ({wishlist.length})</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map(product => (
                    <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition group relative">
                        {/* Remove Button */}
                        <button
                            onClick={() => removeFromWishlist(product.id)}
                            className="absolute top-2 right-2 z-10 bg-white/90 p-2 rounded-full shadow-sm hover:text-red-500 transition"
                            title="Remove from Wishlist"
                        >
                            <Trash2 size={18} />
                        </button>

                        <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                        </Link>

                        <div className="p-4">
                            <Link to={`/product/${product.id}`}>
                                <h3 className="font-bold text-sm truncate mb-1 hover:underline">{product.title}</h3>
                            </Link>
                            <div className="flex justify-between items-center mt-2">
                                <div>
                                    {product.originalPrice && (
                                        <span className="text-xs text-gray-400 line-through mr-2">${product.originalPrice}</span>
                                    )}
                                    <span className="font-bold">${product.price}</span>
                                </div>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
                                    title="Add to Cart"
                                >
                                    <ShoppingBag size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;

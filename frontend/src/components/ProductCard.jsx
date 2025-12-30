import { ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ id, image, title, price, originalPrice }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isLiked = isInWishlist(id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Default size for quick add
        addToCart({ id, image, title, price, originalPrice }, 'M', 1);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist({ id, image, title, price, originalPrice });
    };

    const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return (
        <div className="group relative flex flex-col">
            <Link to={`/product/${id}`}>
                <div className="aspect-[3/4] w-full overflow-hidden relative bg-gray-100">
                    <img
                        src={image || "https://placehold.co/400x600?text=Product"}
                        alt={title}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Discount Badge */}
                    {discountPercentage > 0 && (
                        <div className="absolute top-2 left-0 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 z-10">
                            -{discountPercentage}%
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlist}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
                    >
                        <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>

                    {/* Add to Cart Overlay Button (visible on hover for desktop) */}
                    <button
                        className="absolute bottom-3 right-3 bg-white/90 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black hover:text-white"
                        title="Add to Cart"
                        onClick={handleAddToCart}
                    >
                        <ShoppingBag className="w-5 h-5" />
                    </button>
                </div>
            </Link>

            <div className="mt-2 flex flex-col p-1">
                <h3 className="text-xs text-gray-600 truncate mb-1">
                    <Link to={`/product/${id}`}>
                        {title}
                    </Link>
                </h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-base font-bold text-shein-red">${price}</p>
                    {originalPrice && (
                        <p className="text-xs text-gray-400 line-through">${originalPrice}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

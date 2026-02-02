import { ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ id, image, title, price }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isLiked = isInWishlist(id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Single-size products: use a generic size label internally
        addToCart({ id, image, title, price, originalPrice }, 'ONE_SIZE', 1);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist({ id, image, title, price, originalPrice });
    };

    return (
        <div className="group relative flex flex-col">
            <Link to={`/product/${id}`}>
                <div className="aspect-[3/4] w-full overflow-hidden relative bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center">
                    <img
                        src={image || "https://placehold.co/400x600?text=Product"}
                        alt={title}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain object-center group-hover:scale-105 transition-transform duration-300 dark:opacity-90 dark:group-hover:opacity-100"
                    />

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlist}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black transition-colors z-10"
                    >
                        <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`} />
                    </button>

                    {/* Add to Cart Overlay Button (visible on hover for desktop) */}
                    <button
                        className="absolute bottom-3 right-3 bg-white/90 dark:bg-black/80 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black dark:text-gray-200"
                        title="Add to Cart"
                        onClick={handleAddToCart}
                    >
                        <ShoppingBag className="w-5 h-5" />
                    </button>
                </div>
            </Link>

            <div className="mt-3 flex flex-col px-1 pb-2">
                <h3 className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-1 group-hover:text-black dark:group-hover:text-white transition-colors uppercase tracking-tight">
                    <Link to={`/product/${id}`}>
                        {title}
                    </Link>
                </h3>
                <div className="flex items-center gap-2">
                    <p className="text-sm md:text-base font-black text-black dark:text-white">
                        {Number(price).toLocaleString()} RWF
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

import { ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ id, image, title, price, originalPrice, showDiscount = true }) => {
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
                <div className="aspect-[3/4] w-full overflow-hidden relative bg-gray-100 dark:bg-[#1a1a1a]">
                    <img
                        src={image || "https://placehold.co/400x600?text=Product"}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300 dark:opacity-90 dark:group-hover:opacity-100"
                    />

                    {/* Discount Badge */}
                    {showDiscount && discountPercentage > 0 && (
                        <div className="absolute top-2 left-0 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 z-10">
                            -{discountPercentage}%
                        </div>
                    )}

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
                    <p className="text-sm md:text-base font-black text-black dark:text-white">{price} RWF</p>
                    {showDiscount && originalPrice && (
                        <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 line-through">{originalPrice} RWF</p>
                    )}
                    {showDiscount && discountPercentage > 0 && (
                        <span className="text-[10px] font-bold text-red-500">-{discountPercentage}%</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

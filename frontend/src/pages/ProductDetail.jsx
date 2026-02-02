import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, Truck, ShieldCheck, Heart, Share2, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { API_URL } from '../config';
import { useLanguage } from '../context/LanguageContext';

import ProductCard from '../components/ProductCard'; // Added import

const ProductDetail = () => {
    const { id } = useParams();
    console.log("DEBUG: ProductDetail ID:", id); // Debug log
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const { t } = useLanguage();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [relatedProducts, setRelatedProducts] = useState([]); // New State

    // Review State
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // AI Summary State
    const [aiSummary, setAiSummary] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    // Always scroll to top when opening/changing product
    useEffect(() => {
        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {
            // ignore
        }
    }, [id]);

    // Fetch Reviews
    useEffect(() => {
        if (!id) return;
        fetch(`${API_URL}/api/reviews/product/${id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setReviews(data);
            })
            .catch(err => console.error(err));
    }, [id]);

    // Fetch AI Summary
    useEffect(() => {
        if (!id || reviews.length === 0) return;
        setAiLoading(true);
        fetch(`${API_URL}/api/reviews/product/${id}/summary`)
            .then(res => res.json())
            .then(data => {
                if (data.summary) setAiSummary(data.summary);
            })
            .catch(err => console.error("AI Summary Error:", err))
            .finally(() => setAiLoading(false));
    }, [id, reviews.length]);

    // ... existing effects ...

    // Fetch Product & Related
    useEffect(() => {
        fetch(`${API_URL}/api/products/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed');
                return res.json();
            })
            .then(data => {
                const img = data.image || "https://placehold.co/600x800/ff4081/white?text=Product";
                setProduct({
                    ...data,
                    images: [img, img, img, img],
                    description: data.description || "Description not available."
                });
                setLoading(false);

                // Fetch Related Products (Client-side filtering for now)
                fetch(`${API_URL}/api/products`)
                    .then(res => {
                        if (!res.ok) throw new Error('Failed to fetch related');
                        return res.json();
                    })
                    .then(allProducts => {
                        if (Array.isArray(allProducts)) {
                            // Treat products with similar titles as "other colors" of the same item
                            const baseTitle = String(data.title || '').split('-')[0].trim().toLowerCase();
                            const related = allProducts
                                .filter(p => p.id !== data.id)
                                .map(p => ({
                                    ...p,
                                    _isSameModel:
                                        String(p.title || '').toLowerCase().startsWith(baseTitle) &&
                                        p.category === data.category
                                }))
                                .sort((a, b) => {
                                    // Prefer same-model (different color) variants first
                                    if (a._isSameModel && !b._isSameModel) return -1;
                                    if (!a._isSameModel && b._isSameModel) return 1;
                                    return 0;
                                })
                                .slice(0, 8);
                            setRelatedProducts(related);
                        }
                    })
                    .catch(e => console.error("Related products error:", e));

            })
            .catch(err => {
                console.error("DEBUG: Fetch error:", err);
                setLoading(false);
            });
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: id,
                    userId: user.id,
                    rating: reviewForm.rating,
                    comment: reviewForm.comment
                })
            });
            const newReview = await res.json();
            if (res.ok) {
                setReviews([newReview, ...reviews]);
                setReviewForm({ rating: 5, comment: '' });
                addToast('Review posted successfully!', 'success');
            } else {
                addToast('Failed to post review', 'error');
            }
        } catch (err) {
            console.error(err);
            addToast('Error posting review', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    if (!product) return <div className="p-8 text-center font-bold">Product not found.</div>;

    const images = product.images;

    const nextImage = () => {
        if (!images || images.length === 0) return;
        setActiveImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        if (!images || images.length === 0) return;
        setActiveImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t('nav_home')} / {product.category} / {product.title}
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Image Gallery */}
                <div className="w-full lg:w-3/5 flex flex-col md:flex-row gap-4">
                    {/* Thumbnails (Desktop: left column) */}
                    <div className="hidden md:flex flex-col gap-4 w-28">
                        {/* Current product image */}
                        {images.map((img, idx) => (
                            <button
                                key={`main-${idx}`}
                                type="button"
                                className={`w-full aspect-[3/4] rounded border-2 overflow-hidden bg-white flex items-center justify-center ${activeImage === idx ? 'border-black dark:border-white' : 'border-transparent dark:opacity-60'
                                    }`}
                                onMouseEnter={() => setActiveImage(idx)}
                            >
                                <img
                                    src={img}
                                    alt={`Thumbnail ${idx}`}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </button>
                        ))}

                        {/* Other colours / similar items as small clickable cards */}
                        {relatedProducts.slice(0, 4).map((p) => (
                            <button
                                key={`rel-${p.id}`}
                                type="button"
                                onClick={() => navigate(`/product/${p.id}`)}
                                className="w-full aspect-[3/4] rounded border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-black flex items-center justify-center hover:border-black dark:hover:border-white transition"
                                title={p.title}
                            >
                                <img
                                    src={p.image || img}
                                    alt={p.title}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#111111] rounded-lg relative">
                        <button
                            type="button"
                            onClick={prevImage}
                            className="flex absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/90 dark:bg-black/70 border border-gray-200 dark:border-white/20 items-center justify-center shadow-sm hover:bg-white dark:hover:bg-black transition"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <img
                            src={images[activeImage]}
                            alt={product.title}
                            loading="lazy"
                            className="max-h-[420px] md:max-h-[520px] w-full object-contain rounded-lg dark:opacity-90"
                        />
                        <button
                            type="button"
                            onClick={nextImage}
                            className="flex absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/90 dark:bg-black/70 border border-gray-200 dark:border-white/20 items-center justify-center shadow-sm hover:bg-white dark:hover:bg-black transition"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Thumbnails (Mobile: horizontal strip under main image) */}
                    <div className="mt-4 flex md:hidden gap-3 overflow-x-auto pb-1 -mx-1 px-1">
                        {images.map((img, idx) => (
                            <button
                                key={`mobile-main-${idx}`}
                                type="button"
                                className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden bg-white flex items-center justify-center ${activeImage === idx ? 'border-black' : 'border-transparent'
                                    }`}
                                onClick={() => setActiveImage(idx)}
                            >
                                <img
                                    src={img}
                                    alt={`View ${idx + 1}`}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="w-full lg:w-2/5">
                    <div className="flex justify-between items-start">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{product.title}</h1>
                        <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-black dark:hover:text-white" />
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-black dark:text-shein-red">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({reviews.length} {t('prod_reviews')})</span>
                    </div>

                    <div className="flex items-baseline gap-4 mb-2">
                        <span className="text-3xl font-bold text-shein-red">
                            {Number(product.price).toLocaleString()} RWF
                        </span>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex gap-4 mb-8">
                        <div className="flex items-center border border-gray-300 dark:border-white/10 rounded-full px-4 py-2 dark:text-white">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1"><Minus className="w-4 h-4" /></button>
                            <span className="mx-4 font-bold">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="p-1"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button
                            onClick={() => {
                                addToCart(product, 'ONE_SIZE', quantity);
                                addToast(`Added ${quantity} item(s) to cart`, 'success');
                            }}
                            disabled={(product.stockQuantity || 0) <= 0}
                            className="flex-1 bg-black dark:bg-shein-red text-white font-bold rounded-full py-3 hover:bg-gray-800 dark:hover:bg-red-600 transition shadow-lg disabled:bg-gray-400 dark:disabled:bg-white/10 disabled:cursor-not-allowed"
                        >
                            {(product.stockQuantity || 0) <= 0 ? t('prod_out_of_stock') : t('prod_add_to_cart')}
                        </button>
                        <button
                            onClick={() => toggleWishlist(product)}
                            className={`p-3 border rounded-full transition ${isInWishlist(product.id) ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-gray-300 dark:border-white/10 dark:text-gray-400 hover:border-black dark:hover:border-white'}`}
                        >
                            <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                    </div>

                    {/* Services */}
                    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400 border-t dark:border-white/10 pt-6">
                        <div className="flex items-center gap-3">
                            <Truck className="w-5 h-5" />
                            <span>{t('check_free_ship')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5" />
                            <span>{t('check_return_policy')}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-8 pt-8 border-t dark:border-white/10">
                        <h3 className="font-bold mb-2 dark:text-white">{t('prod_description')}</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* AI Highlights (Gemini) */}
                    {(aiSummary || aiLoading) && (
                        <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl border border-purple-100 dark:border-purple-500/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                                <Star className="w-20 h-20 fill-purple-500" />
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-purple-600 text-white p-1.5 rounded-lg">
                                    <Star className="w-4 h-4 fill-white" />
                                </div>
                                <h3 className="font-black text-purple-900 dark:text-purple-300 uppercase tracking-wider text-xs">AI Review Highlights</h3>
                            </div>
                            {aiLoading ? (
                                <div className="space-y-2 animate-pulse">
                                    <div className="h-4 bg-purple-200 dark:bg-purple-900/40 rounded w-3/4"></div>
                                    <div className="h-4 bg-purple-200 dark:bg-purple-900/40 rounded w-5/6"></div>
                                    <div className="h-4 bg-purple-200 dark:bg-purple-900/40 rounded w-2/3"></div>
                                </div>
                            ) : (
                                <div className="prose prose-sm dark:prose-invert max-w-none text-purple-800 dark:text-purple-400">
                                    <p className="whitespace-pre-line leading-relaxed font-medium">
                                        {aiSummary}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reviews Section */}
                    <div className="mt-12 pt-8 border-t dark:border-white/10">
                        <h3 className="font-bold text-xl mb-6 dark:text-white">{t('prod_reviews')} ({reviews.length})</h3>

                        {/* Review List */}
                        <div className="space-y-6 mb-10">
                            {reviews.length === 0 ? (
                                <p className="text-gray-500 italic dark:text-gray-500">{t('prod_be_first')}</p>
                            ) : (
                                reviews.map(review => (
                                    <div key={review.id} className="border-b dark:border-white/5 pb-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="font-bold dark:text-white">{review.User?.name || 'Anonymous'}</div>
                                                {review.User?.id === user?.id && <span className="text-xs bg-gray-100 dark:bg-white/10 dark:text-gray-300 px-2 py-0.5 rounded">You</span>}
                                            </div>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex text-yellow-500 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-400">{review.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Write Review Form */}
                        {user ? (
                            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl">
                                <h4 className="font-bold mb-4 dark:text-white">{t('prod_write_review')}</h4>
                                <form onSubmit={handleReviewSubmit}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-sm dark:text-gray-300">Rating:</span>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                                className={`text-2xl transition ${star <= reviewForm.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={reviewForm.comment}
                                        onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                        placeholder={t('prod_placeholder_review')}
                                        className="w-full border dark:border-white/10 bg-white dark:bg-black/20 p-3 rounded-lg mb-4 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white dark:text-white"
                                        rows="3"
                                        required
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-black dark:bg-shein-red text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-red-600 disabled:opacity-50"
                                    >
                                        {isSubmitting ? '...' : t('prod_post_review')}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl text-center">
                                <p className="text-gray-600 dark:text-gray-400 mb-4">Please log in to write a review.</p>
                                <button onClick={() => navigate('/login')} className="bg-black dark:bg-shein-red text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-red-600 transition">
                                    Log In
                                </button>
                            </div>
                        )}
                    </div>



                </div>
            </div>

            {/* Related Products - Full Width */}
            <div className="mt-12 pt-8 border-t dark:border-white/10">
                <h3 className="font-bold text-xl mb-6 dark:text-white">{t('prod_related')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {relatedProducts.map(p => (
                        <ProductCard
                            key={p.id}
                            id={p.id}
                            image={p.image}
                            title={p.title}
                            price={p.price}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

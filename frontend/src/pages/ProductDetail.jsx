import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, Truck, ShieldCheck, Heart, Share2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { API_URL } from '../config';

import ProductCard from '../components/ProductCard'; // Added import

const ProductDetail = () => {
    const { id } = useParams();
    console.log("DEBUG: ProductDetail ID:", id); // Debug log
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [relatedProducts, setRelatedProducts] = useState([]); // New State

    // Review State
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                    sizes: (Array.isArray(data.sizes) && data.sizes.length) ? data.sizes : ['XS', 'S', 'M', 'L', 'XL'],
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
                            const related = allProducts
                                .filter(p => p.category === data.category && p.id !== data.id)
                                .sort(() => 0.5 - Math.random()) // Shuffle
                                .slice(0, 4);
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
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!product) return <div className="p-8 text-center font-bold">Product not found.</div>;

    const images = product.images;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <div className="text-sm text-gray-500 mb-6">
                Home / Clothing / {product.title}
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Image Gallery */}
                <div className="w-full lg:w-3/5 flex gap-4">
                    {/* Thumbnails */}
                    <div className="hidden md:flex flex-col gap-4 w-24">
                        {images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Thumbnail ${idx}`}
                                className={`w-full aspect-[3/4] object-cover rounded cursor-pointer border-2 ${activeImage === idx ? 'border-black' : 'border-transparent'}`}
                                onMouseEnter={() => setActiveImage(idx)}
                            />
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="flex-1">
                        <img
                            src={images[activeImage]}
                            alt={product.title}
                            className="w-full aspect-[3/4] object-cover rounded-lg"
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="w-full lg:w-2/5">
                    <div className="flex justify-between items-start">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
                        <Share2 className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black" />
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-black">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <span className="text-sm text-gray-500">({reviews.length} Reviews)</span>
                    </div>

                    <div className="flex items-baseline gap-4 mb-6">
                        <span className="text-3xl font-bold text-accent">${product.price}</span>
                        <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
                        <span className="bg-accent/10 text-accent px-2 py-1 text-xs font-bold rounded">-24%</span>
                    </div>

                    {/* Size Selector */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <span className="font-bold">Size: {selectedSize || 'Select Size'}</span>
                            <button className="text-sm underline text-gray-500">Size Guide</button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-12 h-12 rounded-full border flex items-center justify-center transition
                    ${selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'}
                  `}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex gap-4 mb-8">
                        <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1"><Minus className="w-4 h-4" /></button>
                            <span className="mx-4 font-bold">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="p-1"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button
                            onClick={() => {
                                if (!selectedSize) {
                                    addToast('Please select a size first!', 'error');
                                    return;
                                }
                                addToCart(product, selectedSize, quantity);
                                addToast(`Added ${quantity} item(s) to cart`, 'success');
                            }}
                            className="flex-1 bg-black text-white font-bold rounded-full py-3 hover:bg-gray-800 transition shadow-lg"
                        >
                            ADD TO CART
                        </button>
                        <button
                            onClick={() => toggleWishlist(product)}
                            className={`p-3 border rounded-full transition ${isInWishlist(product.id) ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-black'}`}
                        >
                            <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                    </div>

                    {/* Services */}
                    <div className="space-y-4 text-sm text-gray-600 border-t pt-6">
                        <div className="flex items-center gap-3">
                            <Truck className="w-5 h-5" />
                            <span>Free Standard Shipping on orders over $29.00</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5" />
                            <span>Return Policy: 45 days free return</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-8 pt-8 border-t">
                        <h3 className="font-bold mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-12 pt-8 border-t">
                        <h3 className="font-bold text-xl mb-6">Customer Reviews ({reviews.length})</h3>

                        {/* Review List */}
                        <div className="space-y-6 mb-10">
                            {reviews.length === 0 ? (
                                <p className="text-gray-500 italic">No reviews yet. Be the first to write one!</p>
                            ) : (
                                reviews.map(review => (
                                    <div key={review.id} className="border-b pb-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="font-bold">{review.User?.name || 'Anonymous'}</div>
                                                {review.User?.id === user?.id && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">You</span>}
                                            </div>
                                            <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex text-yellow-500 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <p className="text-gray-700">{review.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Write Review Form */}
                        {user ? (
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h4 className="font-bold mb-4">Write a Review</h4>
                                <form onSubmit={handleReviewSubmit}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-sm">Rating:</span>
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
                                        placeholder="What did you think about this product?"
                                        className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-1 focus:ring-black"
                                        rows="3"
                                        required
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post Review'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-6 rounded-xl text-center">
                                <p className="text-gray-600 mb-4">Please log in to write a review.</p>
                                <button onClick={() => navigate('/login')} className="bg-black text-white px-6 py-2 rounded-lg font-bold">
                                    Log In
                                </button>
                            </div>
                        )}
                    </div>



                </div>
            </div>

            {/* Related Products - Full Width */}
            <div className="mt-12 pt-8 border-t">
                <h3 className="font-bold text-xl mb-6">You May Also Like</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {relatedProducts.map(p => (
                        <ProductCard
                            key={p.id}
                            id={p.id}
                            image={p.image}
                            title={p.title}
                            price={p.price}
                            originalPrice={p.originalPrice}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

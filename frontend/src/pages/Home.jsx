import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [recentOrders, setRecentOrders] = useState([]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Countdown Timer Logic
    const [timeLeft, setTimeLeft] = useState({ h: 2, m: 14, s: 55 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.s > 0) return { ...prev, s: prev.s - 1 };
                if (prev.m > 0) return { h: prev.h, m: prev.m - 1, s: 59 };
                if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
                return { h: 2, m: 14, s: 55 }; // Loop the timer
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (val) => val.toString().padStart(2, '0');

    // Category circles section has been removed to simplify the home page

    const [heroSlides, setHeroSlides] = useState([
        {
            title: "#SummerVibes",
            subtitle: "Season 2026",
            bg: "bg-[#F5E6E0]",
            img: "/products/1688_image_share_3b04ad8a2ffd638d432292fb58b6b481.jpg.jpeg",
            accent: "from-orange-100 to-rose-200",
            products: [
                { img: "/products/1688_image_share_42b89e05b94646e2b8d09ad2df4d8169.jpg.jpeg", price: "45,000", label: "Boho Dress" },
                { img: "/products/1688_image_share_0640a7086ecfb46bef6070992e12f32a.jpg.jpeg", price: "29,000", label: "Linen Top", highlight: true },
                { img: "/products/1688_image_share_106e1631e02d6e9b50eed28f374e79d7.jpg.jpeg", price: "60,000", label: "Designer Bag" },
            ]
        }
    ]);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const nextSlide = () => {
        if (isTransitioning || heroSlides.length === 0) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setTimeout(() => setIsTransitioning(false), 800);
    };

    const prevSlide = () => {
        if (isTransitioning || heroSlides.length === 0) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
        setTimeout(() => setIsTransitioning(false), 800);
    };

    const goToSlide = (index) => {
        if (isTransitioning || index === currentSlide) return;
        setIsTransitioning(true);
        setCurrentSlide(index);
        setTimeout(() => setIsTransitioning(false), 800);
    };

    useEffect(() => {
        if (heroSlides.length === 0) return;
        const timer = setInterval(() => {
            if (!isTransitioning) {
                nextSlide();
            }
        }, 4000); // 4 seconds auto-advance
        return () => clearInterval(timer);
    }, [heroSlides, isTransitioning]);

    // Fetch Products for "New Arrivals" & "Trending" & "Hero Slider"
    useEffect(() => {
        fetch(`${API_URL}/api/products`)
            .then(res => res.json())
            .then(data => {
                // 1. General Product List logic
                const enhancedData = data.map((p, idx) => ({
                    ...p,
                    image: (p.image || '').includes('placehold.co')
                        ? `https://placehold.co/400x500/pink/white?text=Front+${idx + 1}`
                        : p.image
                }));
                setFeaturedProducts(enhancedData);

                // 2. Dynamic Hero Slider Logic (2 Discounted Products)
                const discounted = enhancedData
                    .filter(p => p.originalPrice > p.price)
                    .sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price)); // Sort by discount magnitude

                const top2 = discounted.slice(0, 2);

                if (top2.length > 0) {
                    const newSlides = top2.map((p, i) => {
                        // Pick 3 related/random products for the side grid
                                const sideProducts = enhancedData
                            .filter(ip => ip.id !== p.id)
                            .sort(() => 0.5 - Math.random()) // Shuffle
                            .slice(0, 3)
                            .map(sp => ({
                                img: sp.image,
                                price: Number(sp.price).toLocaleString(),
                                label: sp.title,
                                highlight: Math.random() > 0.5
                            }));

                        // Dynamic colors based on index
                        const accents = [
                            "from-orange-100 to-rose-200",
                            "from-slate-200 to-indigo-300",
                            "from-green-100 to-emerald-200",
                            "from-blue-100 to-cyan-200",
                            "from-purple-100 to-fuchsia-200"
                        ];
                        const bgs = ["bg-[#F5E6E0]", "bg-[#E2E8F0]", "bg-[#E6F5E6]", "bg-[#E0F2F5]", "bg-[#F3E0F5]"];

                        return {
                            title: p.title,
                            subtitle: `${Number(p.price).toLocaleString()} RWF`,
                            bg: bgs[i % bgs.length],
                            img: p.image,
                            accent: accents[i % accents.length],
                            products: sideProducts
                        };
                    });

                    // Add a third promotional slide with 3 products
                    const promoProducts = enhancedData
                        .filter(p => p.id !== top2[0]?.id && p.id !== top2[1]?.id)
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 3)
                        .map(p => ({
                            img: p.image,
                            price: Number(p.price).toLocaleString(),
                            label: p.title,
                            id: p.id
                        }));

                    const promoSlide = {
                        title: "Valentine's Day",
                        subtitle: "550k+ Top Sellers",
                        bg: "bg-gradient-to-br from-pink-400 to-rose-500",
                        accent: "from-pink-200 to-rose-300",
                        products: promoProducts,
                        type: 'promo' // Special promo slide type
                    };

                    // Add a fourth Trends slide with 4 products
                    const trendsProducts = enhancedData
                        .filter(p => p.id !== top2[0]?.id && p.id !== top2[1]?.id)
                        .filter(p => !promoProducts.some(pp => pp.id === p.id))
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 4)
                        .map(p => ({
                            img: p.image,
                            price: Number(p.price).toLocaleString(),
                            label: p.title,
                            id: p.id
                        }));

                    const trendsSlide = {
                        title: "#NewYearNewLook",
                        subtitle: "Trends",
                        bg: "bg-gradient-to-br from-purple-400 to-indigo-500",
                        accent: "from-purple-200 to-indigo-300",
                        products: trendsProducts,
                        type: 'trends' // Trends slide type with 4 products
                    };

                    setHeroSlides([...newSlides, promoSlide, trendsSlide]);
                    setCurrentSlide(0); // Reset to first slide
                }
            })
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    // Fetch recent orders for logged-in customer
    useEffect(() => {
        if (!user) {
            setRecentOrders([]);
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) return;

        fetch(`${API_URL}/api/orders/myorders`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRecentOrders(data.slice(0, 3));
                }
            })
            .catch(err => console.error('Error fetching recent orders:', err));
    }, [user]);

    return (
        <div className="bg-gray-50/50 dark:bg-[#0a0a0a] min-h-screen pb-16 md:pb-12 font-sans transition-colors duration-300 relative">


            {/* HERO SECTION - Unified Slider */}
            <div className={`w-full mb-6 relative overflow-hidden transition-all duration-700 ease-in-out`}
                style={{
                    backgroundColor: heroSlides[currentSlide]?.bg?.replace('bg-[', '').replace(']', '') || '#F5E6E0'
                }}>
                <div className="container mx-auto px-0 md:px-4 flex flex-col md:flex-row h-auto md:h-[500px]">
                    {/* Slider Container */}
                    <div className="w-full h-96 md:h-full relative flex items-center justify-between overflow-hidden px-8 md:px-20">

                        {/* Background Gradient - Animated */}
                        <div
                            key={`gradient-${currentSlide}`}
                            className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].accent} opacity-50 dark:opacity-20 transition-all duration-700 ease-in-out`}
                        ></div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            disabled={isTransitioning}
                            className="absolute left-4 md:left-8 z-30 bg-white/30 backdrop-blur-md hover:bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 md:p-3 transition-all hover:scale-110 shadow-lg"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        <button
                            onClick={nextSlide}
                            disabled={isTransitioning}
                            className="absolute right-4 md:right-8 z-30 bg-white/30 backdrop-blur-md hover:bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 md:p-3 transition-all hover:scale-110 shadow-lg"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        {/* Text Content - Animated */}
                        <div
                            key={`text-${currentSlide}`}
                            className="relative z-10 text-left max-w-xl animate-slide-in-fade"
                        >
                            <div className="text-white text-3xl md:text-5xl font-black italic tracking-tighter mb-4 drop-shadow-md">
                                {heroSlides[currentSlide].subtitle}
                            </div>
                            <div className="text-white text-2xl md:text-6xl font-black mb-8 drop-shadow-lg leading-tight">
                                {heroSlides[currentSlide].title}
                            </div>
                            <button className="bg-white/20 backdrop-blur-md text-white border-2 border-white rounded-full px-8 py-3 hover:bg-white dark:hover:bg-shein-red hover:text-purple-600 dark:hover:text-white transition-all duration-300 font-bold uppercase tracking-widest text-sm hover:scale-105 shadow-lg">
                                Shop Now
                            </button>
                        </div>

                        {/* Conditional: Either Hero Image or Product Grids */}
                        {heroSlides[currentSlide]?.type === 'promo' ? (
                            /* 3-Product Grid for Promo Slide */
                            <div
                                key={`promo-grid-${currentSlide}`}
                                className="hidden md:flex absolute right-8 bottom-8 top-8 gap-4 items-center animate-slide-in-fade"
                            >
                                {heroSlides[currentSlide].products?.map((product, idx) => (
                                    <Link
                                        key={`promo-${idx}`}
                                        to={`/products`}
                                        className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 w-48 animate-slide-in-fade"
                                        style={{
                                            animationDelay: `${idx * 150}ms`
                                        }}
                                    >
                                        {/* Product Image */}
                                        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                            <img
                                                src={product.img}
                                                alt={product.label}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Price Badge */}
                                        <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-black/90 rounded-full px-3 py-1.5 shadow-lg border border-gray-200">
                                            <span className="text-xs font-black text-shein-red">
                                                {product.price} RWF
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : heroSlides[currentSlide]?.type === 'trends' ? (
                            /* 4-Product Grid for Trends Slide */
                            <div
                                key={`trends-grid-${currentSlide}`}
                                className="hidden md:flex absolute right-8 bottom-8 top-8 gap-3 items-center animate-slide-in-fade"
                            >
                                {heroSlides[currentSlide].products?.map((product, idx) => (
                                    <Link
                                        key={`trends-${idx}`}
                                        to={`/products`}
                                        className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 w-44 animate-slide-in-fade"
                                        style={{
                                            animationDelay: `${idx * 120}ms`
                                        }}
                                    >
                                        {/* Product Image */}
                                        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                            <img
                                                src={product.img}
                                                alt={product.label}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Price Badge */}
                                        <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-black/90 rounded-full px-3 py-1.5 shadow-lg border border-gray-200">
                                            <span className="text-xs font-black text-shein-red">
                                                {product.price} RWF
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            /* Regular Hero Image */
                            <>
                                <img
                                    key={`hero-img-${currentSlide}`}
                                    src={heroSlides[currentSlide].img}
                                    alt={heroSlides[currentSlide].title}
                                    className="hidden md:block absolute right-10 bottom-0 h-[110%] w-auto object-contain animate-scale-fade-in drop-shadow-2xl"
                                    style={{
                                        transform: 'rotate(6deg)',
                                        opacity: 0.85,
                                        mixBlendMode: 'normal'
                                    }}
                                />
                            </>
                        )}

                        {/* Mobile Image - Show first product for promo/trends slides */}
                        <img
                            key={`hero-img-mobile-${currentSlide}`}
                            src={heroSlides[currentSlide]?.type === 'promo' || heroSlides[currentSlide]?.type === 'trends'
                                ? heroSlides[currentSlide].products?.[0]?.img
                                : heroSlides[currentSlide].img}
                            alt={heroSlides[currentSlide].title}
                            className="md:hidden absolute -right-10 bottom-0 h-4/5 w-auto object-contain animate-scale-fade-in"
                            style={{
                                transform: 'rotate(6deg)',
                                opacity: 0.6,
                                mixBlendMode: 'multiply'
                            }}
                        />

                        {/* Slide Indicators/Dots */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                            {heroSlides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => goToSlide(idx)}
                                    disabled={isTransitioning}
                                    className={`transition-all duration-300 rounded-full ${currentSlide === idx
                                        ? 'w-8 h-2.5 bg-white shadow-lg'
                                        : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK ACCESS: MY ORDERS (for logged-in users) */}
            {user && (
                <div className="container mx-auto px-4 mt-6">
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-1">
                                YOUR ORDERS
                            </p>
                            {recentOrders.length > 0 ? (
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    You have <span className="font-bold">{recentOrders.length}</span> recent {recentOrders.length === 1 ? 'order' : 'orders'}.
                                </p>
                            ) : (
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    You don&apos;t have any orders yet. Start shopping and track them here.
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {recentOrders.map(order => (
                                <button
                                    key={order.id}
                                    onClick={() => navigate('/orders')}
                                    className="hidden md:flex flex-col px-3 py-2 rounded-lg bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-left"
                                >
                                    <span className="text-[11px] text-gray-500 dark:text-gray-400">Order #{order.id}</span>
                                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                                        {Number(order.totalAmount).toLocaleString()} RWF • {order.status}
                                    </span>
                                </button>
                            ))}
                            <button
                                onClick={() => navigate('/orders')}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black dark:bg-shein-red text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-800 dark:hover:bg-red-600 transition"
                            >
                                View Orders
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOP TRENDS SECTION */}
            <div className="bg-white dark:bg-gray-900 py-6 mb-8 border-y border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-black dark:text-white text-2xl font-black italic">Top Trends</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Fashion accessible to all</p>
                        </div>
                    </div>

                    {/* Scrollable Products Container */}
                    <div className="relative">
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory">
                                                {featuredProducts.slice(0, 8).map((product, idx) => {
                                const badges = ['HOT', 'NEW', 'HOT', 'NEW', 'HOT', 'NEW', 'HOT', 'NEW'];
                                const hashtags = ['#DenimForEveryone', '#SpringMagicList', '#StylishStripes', '#ElegantMaxiDress', '#NeoGirly', '#VDayGiftGuide', '#StreetChic', '#TrendAlert'];
                                const badgeColors = ['bg-orange-500', 'bg-green-500', 'bg-orange-500', 'bg-green-500', 'bg-orange-500', 'bg-green-500', 'bg-orange-500', 'bg-green-500'];
                                const isHot = badges[idx] === 'HOT';
                                const ranking = Math.floor(idx / 2) + 1; // Top 1, Top 2, etc.
                                const daysNew = (idx % 4) + 1; // 1-4 days

                                return (
                                    <Link
                                        key={product.id}
                                        to={`/products/${product.id}`}
                                        className="group relative flex-shrink-0 w-[180px] md:w-[220px] snap-start"
                                    >
                                        {/* Product Image Container */}
                                        <div className="relative h-[280px] md:h-[320px] overflow-hidden rounded-lg bg-gray-200">
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />

                                            {/* Badge */}
                                            <div className={`absolute top-2 left-2 ${badgeColors[idx]} text-white text-xs font-bold px-2 py-1 rounded`}>
                                                {badges[idx]}
                                            </div>

                                            {/* Hover Overlay - Shows Ranking or Days */}
                                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                                <div className="text-center">
                                                    {isHot ? (
                                                        <div>
                                                            <div className="text-orange-400 text-6xl font-black mb-2">{ranking}</div>
                                                            <div className="text-white text-lg font-bold">Top {ranking}</div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <div className="text-green-400 text-5xl font-black mb-2">{daysNew}</div>
                                                            <div className="text-white text-lg font-bold">New in {daysNew} {daysNew === 1 ? 'day' : 'days'}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bottom Overlay with Hashtag */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                                <h3 className="text-white font-bold text-sm mb-1">{hashtags[idx % hashtags.length]}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-black text-lg">
                                                        {Number(product.price).toLocaleString()} RWF
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.currentTarget.parentElement.querySelector('.overflow-x-auto').scrollBy({ left: -240, behavior: 'smooth' });
                            }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg hidden md:block z-10"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.currentTarget.parentElement.querySelector('.overflow-x-auto').scrollBy({ left: 240, behavior: 'smooth' });
                            }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg hidden md:block z-10"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                {/* FLASH SALE / SUPER DEALS SECTION */}
                <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-sm mb-8 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 md:gap-4">
                            <h2 className="text-xl md:text-2xl font-black italic dark:text-white">{t('home_deals_title').slice(0, 5)}<span className="text-shein-red">{t('home_deals_title').slice(5)}</span></h2>
                            <div className="flex items-center gap-1 bg-black dark:bg-shein-red text-white px-2 py-1 md:px-3 rounded text-[10px] md:text-xs font-bold">
                                <span>{formatTime(timeLeft.h)}</span>:<span>{formatTime(timeLeft.m)}</span>:<span>{formatTime(timeLeft.s)}</span>
                            </div>
                        </div>
                        <Link to="/products" className="text-sm font-bold dark:text-gray-300 hover:underline">View All &gt;</Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {featuredProducts.slice(0, 6).map(product => (
                            <ProductCard key={product.id} {...product} showDiscount={true} />
                        ))}
                    </div>
                </div>

                {/* TRENDING / FOR YOU SECTION */}
                <div className="mb-4 text-center relative py-4">
                    <h2 className="text-xl font-bold relative z-10 bg-gray-50/50 dark:bg-[#0a0a0a] dark:text-white inline-block px-4 transition-colors">{t('home_for_you')}</h2>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 dark:bg-white/10 z-0"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">
                    {featuredProducts.map(product => (
                        <ProductCard key={product.id} {...product} showDiscount={false} />
                    ))}
                    {featuredProducts.map(product => (
                        <ProductCard key={`dup-${product.id}`} {...product} showDiscount={false} />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button className="bg-white dark:bg-white/5 border dark:border-white/10 text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black px-12 py-3 uppercase text-sm font-bold tracking-widest transition">
                        View More
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Home;

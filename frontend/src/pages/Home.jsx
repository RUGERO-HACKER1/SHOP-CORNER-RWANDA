import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { ChevronRight, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Mock Categories for Circular Menu
    const categories = [
        { name: 'Women', img: '/products/1688_image_share_00fd72eb0b77844eaebd4c1f1e5486f5.jpg.jpeg' },
        { name: 'Curve', img: '/products/1688_image_share_077da0a9225e1f657bfa92fede15526a.jpg.jpeg' },
        { name: 'Kids', img: '/products/1688_image_share_08be20a33e3de81f897b9a1e6ac44eb3.jpg.jpeg' },
        { name: 'Men', img: '/products/1688_image_share_0eadaa09a3780d4865e884512dd8a763.jpg.jpeg' },
        { name: 'Bottoms', img: '/products/1688_image_share_0f2565000bdfaa140f46fa3cfa2d1f4b.jpg.jpeg' },
        { name: 'Outerwear', img: '/products/1688_image_share_106e1631e02d6e9b50eed28f374e79d7.jpg.jpeg' },
        { name: 'Shoes', img: '/products/1688_image_share_13741cf1be340ca6f56ae6cb3359260d.jpg.jpeg' },
        { name: 'Accessories', img: '/products/1688_image_share_1447c9a341d4a0cb37663efd88317881.jpg.jpeg' },
        { name: 'Jewelry', img: '/products/1688_image_share_177e205382cdd5390bdc6be5a8283dc6.jpg.jpeg' },
        { name: 'Bags', img: '/products/1688_image_share_25d220710b5bedd4075e546ae389e3f1.jpg.jpeg' },
        { name: 'Lingerie', img: '/products/1688_image_share_1ea23752a1751fa69f5f14fb8bcdc372.jpg.jpeg' },
        { name: 'Home', img: '/products/1688_image_share_1688_image_share_0640a7086ecfb46bef6070992e12f32a.jpg.jpeg' },
    ];

    const slides = [
        {
            title: "#SummerVibes",
            subtitle: "Season 2026",
            bg: "bg-[#F5E6E0]",
            img: "/products/1688_image_share_3b04ad8a2ffd638d432292fb58b6b481.jpg.jpeg",
            accent: "from-orange-100 to-rose-200",
            products: [
                { img: "/products/1688_image_share_42b89e05b94646e2b8d09ad2df4d8169.jpg.jpeg", price: "45,000 RWF", label: "Boho Dress" },
                { img: "/products/1688_image_share_0640a7086ecfb46bef6070992e12f32a.jpg.jpeg", price: "29,000 RWF", label: "Linen Top", highlight: true },
                { img: "/products/1688_image_share_106e1631e02d6e9b50eed28f374e79d7.jpg.jpeg", price: "60,000 RWF", label: "Designer Bag" },
            ]
        },
        {
            title: "Night Out",
            subtitle: "Trending Now",
            bg: "bg-[#E2E8F0]",
            img: "/products/1688_image_share_73e9c606f8fc0dcc1d2c750215cacc19.jpg.jpeg",
            accent: "from-slate-200 to-indigo-300",
            products: [
                { img: "/products/1688_image_share_2ab43c500b06fccdd56dcf110a974d86.jpg.jpeg", price: "89,000 RWF", label: "Evening Gown" },
                { img: "/products/1688_image_share_3cc73f2c1b54d0e5823553608b03a2eb.jpg.jpeg", price: "55,000 RWF", label: "Stiletto Heels", highlight: true },
                { img: "/products/1688_image_share_58303c8cdef2b16d9a6099f1fe9899c7.jpg.jpeg", price: "45,000 RWF", label: "Clutch" },
            ]
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 1500);
        return () => clearInterval(timer);
    }, []);

    // Fetch Products for "New Arrivals" & "Trending"
    useEffect(() => {
        fetch(`${API_URL}/api/products`)
            .then(res => res.json())
            .then(data => {
                // Inject Front/Back logic for grid demo
                const enhancedData = data.map((p, idx) => ({
                    ...p,
                    image: p.image.includes('placehold.co') ? `https://placehold.co/400x500/pink/white?text=Front+${idx + 1}` : p.image
                }));
                setFeaturedProducts(enhancedData);
            })
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    return (
        <div className="bg-gray-50/50 dark:bg-[#0a0a0a] min-h-screen pb-16 md:pb-12 font-sans transition-colors duration-300 relative">


            {/* HERO SECTION - Unified Slider */}
            <div className={`w-full ${slides[currentSlide].bg} mb-6 transition-colors duration-300 ease-in-out`}>
                <div className="container mx-auto px-0 md:px-4 flex flex-col md:flex-row h-auto md:h-[450px]">
                    {/* Left Banner (Slider) */}
                    <div className="w-full md:w-1/3 h-80 md:h-full relative flex items-center justify-center overflow-hidden transition-all duration-300">
                        <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].accent} opacity-50 dark:opacity-20`}></div>
                        <div className="relative z-10 text-center p-8 transition-opacity duration-300 animate-fade-in-up">
                            <div className="text-white text-3xl md:text-4xl font-black italic tracking-tighter mb-2 drop-shadow-md">{slides[currentSlide].subtitle}</div>
                            <div className="text-white text-xl md:text-2xl font-bold mb-4 drop-shadow-md">{slides[currentSlide].title}</div>
                            <button className="bg-white/20 backdrop-blur-md text-white border-2 border-white rounded-full p-2 hover:bg-white dark:hover:bg-shein-red hover:text-purple-600 dark:hover:text-white transition">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                        <img
                            key={`hero-img-${currentSlide}`}
                            src={slides[currentSlide].img}
                            className="absolute bottom-0 right-0 h-4/5 object-contain rotate-6 opacity-80 mix-blend-multiply animate-slide-in-right"
                        />

                        {/* Slide Dots - Mobile Only usually, but keeping here for interactions */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`w-2 h-2 rounded-full ${currentSlide === idx ? 'bg-white' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Slider / Promo Area - Dynamic Content */}
                    <div className="w-full md:w-2/3 bg-white/50 dark:bg-black/20 backdrop-blur-sm h-auto md:h-full p-1 md:p-4 flex flex-row gap-1 md:gap-4 items-center overflow-hidden">
                        {slides[currentSlide].products.map((prod, idx) => (
                            <div key={`${currentSlide}-${idx}`} className="flex-1 min-w-0 h-[180px] xs:h-[220px] sm:h-[280px] md:h-[380px] bg-white dark:bg-[#1a1a1a] rounded-md relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
                                <img src={prod.img} className="w-full h-full object-cover transition duration-500 group-hover:scale-110 opacity-100 dark:opacity-90" alt={prod.label} />
                                <div className={`absolute bottom-1 left-1 md:bottom-4 md:left-4 bg-white/90 dark:bg-black/80 dark:text-white px-1.5 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] xs:text-[10px] md:text-lg font-bold shadow-sm ${prod.highlight ? 'text-shein-red' : 'text-black'}`}>
                                    {prod.price}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* PROMO BANNER SECTION */}
            <div className="container mx-auto px-4 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative h-[300px] overflow-hidden rounded-2xl group cursor-pointer shadow-lg hover:shadow-xl transition-all">
                        <img src="/products/1688_image_share_3cc73f2c1b54d0e5823553608b03a2eb.jpg.jpeg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-10">
                            <span className="text-shein-red font-black uppercase tracking-widest text-xs mb-2">New Arrival</span>
                            <h3 className="text-white text-3xl font-black mb-4">Step Into <br /> Style</h3>
                            <Link to="/products?category=Shoes" className="bg-white dark:bg-black/60 dark:text-white backdrop-blur-md font-bold px-6 py-2 rounded-full w-fit hover:bg-shein-red hover:text-white transition-colors">Shop Shoes</Link>
                        </div>
                    </div>
                    <div className="relative h-[300px] overflow-hidden rounded-2xl group cursor-pointer shadow-lg hover:shadow-xl transition-all">
                        <img src="/products/1688_image_share_106e1631e02d6e9b50eed28f374e79d7.jpg.jpeg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-10">
                            <span className="text-shein-red font-black uppercase tracking-widest text-xs mb-2">Essential</span>
                            <h3 className="text-white text-3xl font-black mb-4">{t('home_hero_title')}</h3>
                            <Link to="/products?category=Bags" className="bg-white dark:bg-black/60 dark:text-white backdrop-blur-md font-bold px-6 py-2 rounded-full w-fit hover:bg-shein-red hover:text-white transition-colors">{t('home_hero_cta')}</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                {/* CATEGORY CIRCLES - Expanded Grid */}
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3 md:gap-4 mb-16 border-b pb-8 border-gray-100 dark:border-white/5">
                    {categories.map((cat) => (
                        <Link to={`/products?category=${cat.name}`} key={cat.name} className="flex flex-col items-center group">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-shein-red transition-all duration-300 p-0.5 shadow-sm group-hover:shadow-md">
                                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition duration-500 dark:opacity-80 dark:group-hover:opacity-100" />
                            </div>
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-tighter text-gray-400 dark:text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">{cat.name}</span>
                        </Link>
                    ))}
                </div>

                {/* FLASH SALE / SUPER DEALS SECTION */}
                <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-sm mb-8 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 md:gap-4">
                            <h2 className="text-xl md:text-2xl font-black italic dark:text-white">{t('home_deals_title').slice(0, 5)}<span className="text-shein-red">{t('home_deals_title').slice(5)}</span></h2>
                            <div className="flex items-center gap-1 bg-black dark:bg-shein-red text-white px-2 py-1 md:px-3 rounded text-[10px] md:text-xs font-bold">
                                <span>02</span>:<span>14</span>:<span>55</span>
                            </div>
                        </div>
                        <Link to="/products" className="text-sm font-bold dark:text-gray-300 hover:underline">View All &gt;</Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {featuredProducts.slice(0, 6).map(product => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                </div>

                {/* TRENDING / FOR YOU SECTION */}
                <div className="mb-4 text-center relative py-4">
                    <h2 className="text-xl font-bold relative z-10 bg-gray-50/50 dark:bg-[#0a0a0a] dark:text-white inline-block px-4 transition-colors">{t('home_trending')}</h2>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 dark:bg-white/10 z-0"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">
                    {featuredProducts.map(product => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                    {featuredProducts.map(product => (
                        <ProductCard key={`dup-${product.id}`} {...product} />
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

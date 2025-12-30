import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { ChevronRight } from 'lucide-react';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    // Mock Categories for Circular Menu
    const categories = [
        { name: 'Women', img: 'https://placehold.co/100x100?text=Women' },
        { name: 'Curve', img: 'https://placehold.co/100x100?text=Curve' },
        { name: 'Kids', img: 'https://placehold.co/100x100?text=Kids' },
        { name: 'Men', img: 'https://placehold.co/100x100?text=Men' },
        { name: 'Bottoms', img: 'https://placehold.co/100x100?text=Bottoms' },
        { name: 'Home', img: 'https://placehold.co/100x100?text=Home' },
        { name: 'Shoes', img: 'https://placehold.co/100x100?text=Shoes' },
        { name: 'Beauty', img: 'https://placehold.co/100x100?text=Beauty' },
        { name: 'Jewelry', img: 'https://placehold.co/100x100?text=Jewelry' },
        { name: 'Bags', img: 'https://placehold.co/100x100?text=Bags' },
        { name: 'Lingerie', img: 'https://placehold.co/100x100?text=Lingerie' },
        { name: 'Electronics', img: 'https://placehold.co/100x100?text=Tech' },
        { name: 'Sports', img: 'https://placehold.co/100x100?text=Sports' },
        { name: 'Pets', img: 'https://placehold.co/100x100?text=Pets' },
        { name: 'Office', img: 'https://placehold.co/100x100?text=Office' },
        { name: 'Toys', img: 'https://placehold.co/100x100?text=Toys' },
    ];

    const slides = [
        {
            title: "#FloralPop",
            subtitle: "trends",
            bg: "bg-[#E5D4FA]",
            img: "https://placehold.co/400x500?text=Floral+Trend",
            accent: "from-violet-300 to-purple-400",
            products: [
                { img: "https://placehold.co/300x450?text=Floral+Front", imgBack: "https://placehold.co/300x450?text=Floral+Back", price: "$41.10", label: "Floral Midi" },
                { img: "https://placehold.co/300x450?text=Ruffle+Front", imgBack: "https://placehold.co/300x450?text=Ruffle+Back", price: "$19.04", label: "Ruffle Dress", highlight: true },
                { img: "https://placehold.co/300x450?text=Blouse+Front", imgBack: "https://placehold.co/300x450?text=Blouse+Back", price: "$30.00", label: "Blouse" },
            ]
        },
        {
            title: "Summer Vibes",
            subtitle: "New In",
            bg: "bg-[#FAD4D4]",
            img: "https://placehold.co/400x500?text=Summer+Trend",
            accent: "from-red-200 to-pink-300",
            products: [
                { img: "https://placehold.co/300x450?text=Beach+Front", imgBack: "https://placehold.co/300x450?text=Beach+Back", price: "$22.50", label: "Beach Dress" },
                { img: "https://placehold.co/300x450?text=Tank+Front", imgBack: "https://placehold.co/300x450?text=Tank+Back", price: "$15.00", label: "Tank Top", highlight: true },
                { img: "https://placehold.co/300x450?text=Sandal+Front", imgBack: "https://placehold.co/300x450?text=Sandal+Back", price: "$45.00", label: "Sandals" },
            ]
        },
        {
            title: "Denim Days",
            subtitle: "Best Sellers",
            bg: "bg-[#D4E2FA]",
            img: "https://placehold.co/400x500?text=Jeans+Trend",
            accent: "from-blue-200 to-cyan-300",
            products: [
                { img: "https://placehold.co/300x450?text=Skinny+Front", imgBack: "https://placehold.co/300x450?text=Skinny+Back", price: "$35.99", label: "Skinny Jeans" },
                { img: "https://placehold.co/300x450?text=Jacket+Front", imgBack: "https://placehold.co/300x450?text=Jacket+Back", price: "$28.00", label: "Jacket", highlight: true },
                { img: "https://placehold.co/300x450?text=Shorts+Front", imgBack: "https://placehold.co/300x450?text=Shorts+Back", price: "$12.99", label: "Shorts" },
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
        <div className="bg-gray-50/50 min-h-screen pb-12 font-sans">

            {/* HERO SECTION - Unified Slider */}
            <div className={`w-full ${slides[currentSlide].bg} mb-6 transition-colors duration-300 ease-in-out`}>
                <div className="container mx-auto px-0 md:px-4 flex flex-col md:flex-row h-auto md:h-[450px]">
                    {/* Left Banner (Slider) */}
                    <div className="w-full md:w-1/3 h-64 md:h-full relative flex items-center justify-center overflow-hidden transition-all duration-300">
                        <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].accent} opacity-50`}></div>
                        <div className="relative z-10 text-center p-8 transition-opacity duration-300 animate-fade-in-up">
                            <div className="text-white text-4xl font-black italic tracking-tighter mb-2 drop-shadow-md">{slides[currentSlide].subtitle}</div>
                            <div className="text-white text-2xl font-bold mb-4 drop-shadow-md">{slides[currentSlide].title}</div>
                            <button className="bg-white/20 backdrop-blur-md text-white border-2 border-white rounded-full p-2 hover:bg-white hover:text-purple-600 transition">
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
                    <div className="w-full md:w-2/3 bg-white/50 backdrop-blur-sm h-auto md:h-full p-4 flex gap-4 overflow-x-auto no-scrollbar items-center">
                        {slides[currentSlide].products.map((prod, idx) => (
                            <div key={`${currentSlide}-${idx}`} className="flex-shrink-0 w-60 h-[380px] bg-white rounded-md relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
                                <img src={prod.img} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                <div className={`absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full text-lg font-bold shadow-sm ${prod.highlight ? 'text-shein-red' : 'text-black'}`}>
                                    {prod.price}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                {/* CATEGORY CIRCLES - Expanded Grid */}
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-10">
                    {categories.map((cat) => (
                        <Link to={`/products?category=${cat.name}`} key={cat.name} className="flex flex-col items-center group">
                            <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border hover:border-black transition">
                                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                            </div>
                            <span className="text-sm font-medium text-gray-800 group-hover:font-bold">{cat.name}</span>
                        </Link>
                    ))}
                </div>

                {/* FLASH SALE / SUPER DEALS SECTION */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black italic">Super<span className="text-shein-red">Deals</span></h2>
                            <div className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded text-xs font-bold">
                                <span>02</span>:<span>14</span>:<span>55</span>
                            </div>
                        </div>
                        <Link to="/products" className="text-sm font-bold hover:underline">View All &gt;</Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {featuredProducts.slice(0, 6).map(product => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                </div>

                {/* TRENDING / FOR YOU SECTION */}
                <div className="mb-4 text-center relative py-4">
                    <h2 className="text-xl font-bold relative z-10 bg-gray-50/50 inline-block px-4">For You</h2>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 z-0"></div>
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
                    <button className="bg-white border text-black hover:bg-black hover:text-white px-12 py-3 uppercase text-sm font-bold tracking-widest transition">
                        View More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;

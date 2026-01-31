import { Search, ShoppingBag, Heart, User, LogOut, LayoutDashboard, Globe, MessageCircle, Package, Menu, X, Sun, Moon, Shirt, UserCircle, Baby, Users, Sparkles, Footprints, ShoppingCart, Gem, Palette, Smartphone, Home, BookOpen, Bike, PawPrint, Car, CloudSnow, Wand2, Scissors, Columns, Layers, Component, Copy, ShieldCheck, Shield, RefreshCcw, Ship, Wrench, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [searchParams] = useSearchParams();
    const currentCategory = searchParams.get('category');
    const [drawerTab, setDrawerTab] = useState('categories'); // 'categories' or 'general'

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setShowMobileSearch(false);
        }
    };

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <>
            <nav className="sticky top-0 z-50 glass shadow-sm font-sans transition-all duration-300 dark:border-white/5">
                {/* Row 1: Top Bar (Black) - Mocking the top strip */}
                <div className="bg-white dark:bg-black text-[10px] md:text-xs border-b border-gray-100 dark:border-white/5">
                    <div className="container mx-auto px-4 h-9 flex items-center justify-between text-gray-600 dark:text-gray-300">
                        <div className="flex items-center justify-between w-full max-w-sm md:max-w-none md:justify-start md:space-x-12">
                            <Link to="/" className="hover:text-black dark:hover:text-white transition uppercase tracking-tighter md:tracking-wider whitespace-nowrap text-[8px] xs:text-[10px] md:text-xs">{t('nav_home')}</Link>
                            <Link to="/products" className="hover:text-black dark:hover:text-white transition uppercase tracking-tighter md:tracking-wider whitespace-nowrap text-[8px] xs:text-[10px] md:text-xs">{t('nav_products')}</Link>
                            <Link to="/about" className="hover:text-black dark:hover:text-white transition uppercase tracking-tighter md:tracking-wider whitespace-nowrap text-[8px] xs:text-[10px] md:text-xs">{t('nav_about')}</Link>
                            <Link to="/contact" className="hover:text-black dark:hover:text-white transition uppercase tracking-tighter md:tracking-wider whitespace-nowrap text-[8px] xs:text-[10px] md:text-xs">{t('nav_contact')}</Link>
                        </div>
                    </div>
                </div>

                {/* Row 2: Main Header */}
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    {/* LEFT: Menu Button & Logo */}
                    <div className="flex items-center gap-2 md:gap-4 flex-1">
                        <button
                            className="md:hidden text-black dark:text-white p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition relative z-[60]"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMobileMenuOpen(true);
                            }}
                            aria-label="Open Menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <Link to="/" className="flex items-center gap-3 group no-underline">
                            <img
                                src="/shop-corner-final-logo.png"
                                alt="Shop Corner Rwanda"
                                className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg shadow-sm transition-transform group-hover:scale-105"
                            />
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-lg md:text-xl font-black text-black dark:text-white tracking-tighter uppercase whitespace-nowrap">
                                    SHOP<span className="text-shein-red">CORNER</span>
                                    <span className="block text-[8px] md:text-[10px] tracking-[0.2em] text-shein-red font-black mt-0.5">RWANDA</span>
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* CENTER: Search (Desktop Only) */}
                    <div className="hidden md:flex flex-[2] max-w-xl relative group px-4">
                        <input
                            type="text"
                            placeholder={t('nav_search_placeholder')}
                            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-full py-2.5 px-6 focus:ring-2 focus:ring-shein-red focus:bg-white dark:focus:bg-black transition-all text-sm placeholder-gray-400 text-black dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-shein-red transition"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* RIGHT: Mobile Icons & Desktop Icons */}
                    <div className="flex items-center justify-end gap-1 md:gap-6 flex-1">
                        {/* Mobile Icons */}
                        <div className="flex md:hidden items-center space-x-0.5">
                            <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="p-2 text-black dark:text-white active:scale-95 transition">
                                <Search className="w-5 h-5 stroke-2" />
                            </button>
                            <button
                                onClick={() => setLanguage(language === 'en' ? 'rw' : 'en')}
                                className="p-2 text-black dark:text-white font-bold text-[10px]"
                            >
                                {language === 'en' ? 'RW' : 'EN'}
                            </button>
                            <Link to="/cart" className="p-2 text-black dark:text-white relative">
                                <ShoppingBag className="w-5 h-5 stroke-2" />
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-shein-red text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* Desktop Icons */}
                        <div className="hidden md:flex items-center space-x-6">
                            <button
                                onClick={toggleTheme}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                {theme === 'light' ? <Moon className="w-5 h-5 stroke-1" /> : <Sun className="w-5 h-5 stroke-1" />}
                            </button>
                            <button
                                onClick={() => setLanguage(language === 'en' ? 'rw' : 'en')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-[10px] font-bold"
                            >
                                {language === 'en' ? 'RW' : 'EN'}
                            </button>
                            <Link to="/cart" className="hover:text-gray-600 dark:hover:text-gray-300 transition relative">
                                <ShoppingBag className="h-6 w-6 stroke-1" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-black dark:bg-shein-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <div className="relative group">
                                {user ? (
                                    <div className="relative">
                                        <button onClick={() => setShowUserMenu(!showUserMenu)} className="hover:text-gray-600 transition">
                                            <User className="h-6 w-6 stroke-1" />
                                        </button>
                                        {showUserMenu && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded shadow-lg py-1 z-50">
                                                <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
                                                    <p className="text-sm font-bold truncate">Hi, {user.name}</p>
                                                </div>
                                                <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5">
                                                    <User className="w-4 h-4 mr-2" /> My Profile
                                                </Link>
                                                <Link
                                                    to="/orders"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 text-left"
                                                >
                                                    <Package className="w-4 h-4 mr-2" /> {t('nav_orders')}
                                                </Link>
                                                {user.role === 'admin' && (
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setShowUserMenu(false)}
                                                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 text-left"
                                                    >
                                                        <LayoutDashboard className="w-4 h-4 mr-2" /> Admin Dashboard
                                                    </Link>
                                                )}
                                                <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 text-red-600 dark:text-red-500">
                                                    <LogOut className="w-4 h-4 mr-2" /> Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link to="/login" className="hover:text-gray-600 dark:hover:text-gray-300 transition">
                                        <User className="h-6 w-6 stroke-1" />
                                    </Link>
                                )}
                            </div>
                            {/* Wishlist */}
                            <Link to="/wishlist" className="relative hover:text-gray-600 dark:hover:text-gray-300 transition">
                                <Heart className="h-6 w-6 stroke-1" />
                                {wishlist.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Row 3: Simplified Sub Navigation */}
                <div className="border-t border-gray-100 dark:border-white/10 bg-white dark:bg-black/50 relative">
                    <div className="container mx-auto px-4 h-12 flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {/* All Categories with Mega Menu */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 hover:text-black dark:hover:text-white transition h-12">
                                <Menu className="w-4 h-4" />
                                <span>{currentCategory || 'All categories'}</span>
                            </button>

                            {/* Mega Menu Dropdown */}
                            <div className="hidden group-hover:block absolute left-0 top-full w-[1300px] bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-white/10 rounded-b-lg z-50">
                                <div className="flex">
                                    {/* Left Sidebar - Category List */}
                                    <div className="w-80 border-r border-gray-200 dark:border-white/10 p-6 bg-gray-50 dark:bg-gray-800/50">
                                        <h3 className="text-base font-bold text-gray-500 dark:text-gray-400 mb-6">CATEGORIES FOR YOU</h3>
                                        <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
                                            <Link to="/products?category=Women" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Users className="w-6 h-6" />
                                                <span>Women</span>
                                            </Link>
                                            <Link to="/products?category=Men" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <UserCircle className="w-6 h-6" />
                                                <span>Men</span>
                                            </Link>
                                            <Link to="/products?category=Kids" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Baby className="w-6 h-6" />
                                                <span>Kids</span>
                                            </Link>
                                            <Link to="/products?category=Curve" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Sparkles className="w-6 h-6" />
                                                <span>Curve</span>
                                            </Link>
                                            <Link to="/products?category=Dresses" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Scissors className="w-6 h-6" />
                                                <span>Dresses</span>
                                            </Link>
                                            <Link to="/products?category=Tops" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Shirt className="w-6 h-6" />
                                                <span>Tops</span>
                                            </Link>
                                            <Link to="/products?category=Bottoms" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Columns className="w-6 h-6" />
                                                <span>Bottoms</span>
                                            </Link>
                                            <Link to="/products?category=Denim" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Layers className="w-6 h-6" />
                                                <span>Denim</span>
                                            </Link>
                                            <Link to="/products?category=Jumpsuits & Bodysuits" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Component className="w-6 h-6" />
                                                <span>Jumpsuits & Bodysuits</span>
                                            </Link>
                                            <Link to="/products?category=Co-ords" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Copy className="w-6 h-6" />
                                                <span>Co-ords</span>
                                            </Link>
                                            <Link to="/products?category=Underwear & Sleepwear" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Heart className="w-6 h-6" />
                                                <span>Underwear & Sleepwear</span>
                                            </Link>
                                            <Link to="/products?category=Shoes" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Footprints className="w-6 h-6" />
                                                <span>Shoes</span>
                                            </Link>
                                            <Link to="/products?category=Bags & Luggage" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <ShoppingCart className="w-6 h-6" />
                                                <span>Bags & Luggage</span>
                                            </Link>
                                            <Link to="/products?category=Jewelry & Accessories" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Gem className="w-6 h-6" />
                                                <span>Jewelry & Accessories</span>
                                            </Link>
                                            <Link to="/products?category=Beauty & Health" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Palette className="w-6 h-6" />
                                                <span>Beauty & Health</span>
                                            </Link>
                                            <Link to="/products?category=Cell Phones & Accessories" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Smartphone className="w-6 h-6" />
                                                <span>Cell Phones & Accessories</span>
                                            </Link>
                                            <Link to="/products?category=Home & Living" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Home className="w-6 h-6" />
                                                <span>Home & Living</span>
                                            </Link>
                                            <Link to="/products?category=Office & School Supplies" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <BookOpen className="w-6 h-6" />
                                                <span>Office & School Supplies</span>
                                            </Link>
                                            <Link to="/products?category=Sports & Outdoor" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Bike className="w-6 h-6" />
                                                <span>Sports & Outdoor</span>
                                            </Link>
                                            <Link to="/products?category=Baby & Maternity" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Baby className="w-6 h-6" />
                                                <span>Baby & Maternity</span>
                                            </Link>
                                            <Link to="/products?category=Pet Supplies" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <PawPrint className="w-6 h-6" />
                                                <span>Pet Supplies</span>
                                            </Link>
                                            <Link to="/products?category=Automotive" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Car className="w-6 h-6" />
                                                <span>Automotive</span>
                                            </Link>
                                            <Link to="/products?category=Fall & Winter" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <CloudSnow className="w-6 h-6" />
                                                <span>Fall & Winter</span>
                                            </Link>
                                            <Link to="/products?category=Customization" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Wand2 className="w-6 h-6" />
                                                <span>Customization</span>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Right Side - Featured Categories with Images */}
                                    <div className="flex-1 p-6">
                                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Categories for you</h3>
                                        <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                                            <div className="grid grid-cols-5 gap-5">
                                                <Link to="/products?category=Women" className="group/item text-center">
                                                    <div className="w-28 h-28 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_00fd72eb0b77844eaebd4c1f1e5486f5.jpg.jpeg" alt="Women" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Women's Clothing</p>
                                                </Link>
                                                <Link to="/products?category=Men" className="group/item text-center">
                                                    <div className="w-28 h-28 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_08be20a33e3de81f897b9a1e6ac44eb3.jpg.jpeg" alt="Men" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Men's Fashion</p>
                                                </Link>
                                                <Link to="/products?category=Kids" className="group/item text-center">
                                                    <div className="w-28 h-28 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_08be20a33e3de81f897b9a1e6ac44eb3.jpg.jpeg" alt="Kids" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Kids</p>
                                                </Link>
                                                <Link to="/products?category=Curve" className="group/item text-center">
                                                    <div className="w-28 h-28 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_077da0a9225e1f657bfa92fede15526a.jpg.jpeg" alt="Curve" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Curve & Plus</p>
                                                </Link>
                                                <Link to="/products?category=Dresses" className="group/item text-center">
                                                    <div className="w-28 h-28 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_42b89e05b94646e2b8d09ad2df4d8169.jpg.jpeg" alt="Dresses" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Dresses</p>
                                                </Link>
                                                <Link to="/products?category=Tops" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_3b04ad8a2ffd638d432292fb58b6b481.jpg.jpeg" alt="Tops" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Tops & Tees</p>
                                                </Link>
                                                <Link to="/products?category=Denim" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_0f2565000bdfaa140f46fa3cfa2d1f4b.jpg.jpeg" alt="Denim" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Denim</p>
                                                </Link>
                                                <Link to="/products?category=Bottoms" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_0f2565000bdfaa140f46fa3cfa2d1f4b.jpg.jpeg" alt="Bottoms" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Bottoms</p>
                                                </Link>
                                                <Link to="/products?category=Shoes" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_3cc73f2c1b54d0e5823553608b03a2eb.jpg.jpeg" alt="Shoes" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Footwear</p>
                                                </Link>
                                                <Link to="/products?category=Co-ords" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_3b04ad8a2ffd638d432292fb58b6b481.jpg.jpeg" alt="Co-ords" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Co-ords</p>
                                                </Link>
                                                <Link to="/products?category=Underwear & Sleepwear" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1ea23752a1751fa69f5f14fb8bcdc372.jpg.jpeg" alt="Underwear" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Sleepwear</p>
                                                </Link>
                                                <Link to="/products?category=Bags & Luggage" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_25d220710b5bedd4075e546ae389e3f1.jpg.jpeg" alt="Bags" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Bags</p>
                                                </Link>
                                                <Link to="/products?category=Jewelry & Accessories" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1447c9a341d4a0cb37663efd88317881.jpg.jpeg" alt="Jewelry" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Jewelry</p>
                                                </Link>
                                                <Link to="/products?category=Cell Phones & Accessories" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_177e205382cdd5390bdc6be5a8283dc6.jpg.jpeg" alt="Phones" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Phones</p>
                                                </Link>
                                                <Link to="/products?category=Beauty & Health" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_00fd72eb0b77844eaebd4c1f1e5486f5.jpg.jpeg" alt="Beauty" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Beauty</p>
                                                </Link>
                                                <Link to="/products?category=Home & Living" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1ea23752a1751fa69f5f14fb8bcdc372.jpg.jpeg" alt="Home" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Home</p>
                                                </Link>
                                                <Link to="/products?category=Office & School Supplies" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_106e1631e02d6e9b50eed28f374e79d7.jpg.jpeg" alt="Office" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Office</p>
                                                </Link>
                                                <Link to="/products?category=Jumpsuits & Bodysuits" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_42b89e05b94646e2b8d09ad2df4d8169.jpg.jpeg" alt="Jumpsuits" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Jumpsuits</p>
                                                </Link>
                                                <Link to="/products?category=Sports & Outdoor" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_3cc73f2c1b54d0e5823553608b03a2eb.jpg.jpeg" alt="Sports" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Sports</p>
                                                </Link>
                                                <Link to="/products?category=Automotive" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_177e205382cdd5390bdc6be5a8283dc6.jpg.jpeg" alt="Auto" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Automotive</p>
                                                </Link>
                                                <Link to="/products?category=Baby & Maternity" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_106e1631e02d6e9b50eed28f374e79d7.jpg.jpeg" alt="Baby" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Baby</p>
                                                </Link>
                                                <Link to="/products?category=Pet Supplies" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_25d220710b5bedd4075e546ae389e3f1.jpg.jpeg" alt="Pets" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Pet Supplies</p>
                                                </Link>
                                                <Link to="/products?category=Fall & Winter" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_077da0a9225e1f657bfa92fede15526a.jpg.jpeg" alt="Winter" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Winter Wear</p>
                                                </Link>
                                                <Link to="/products?category=Customization" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1447c9a341d4a0cb37663efd88317881.jpg.jpeg" alt="Custom" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Custom</p>
                                                </Link>
                                                {/* Row 2 - More variety */}
                                                <Link to="/products?category=Dresses" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_3b04ad8a2ffd638d432292fb58b6b481.jpg.jpeg" alt="Casual Dresses" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Casual Dresses</p>
                                                </Link>
                                                <Link to="/products?category=Tops" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_00fd72eb0b77844eaebd4c1f1e5486f5.jpg.jpeg" alt="Blouses" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Blouses</p>
                                                </Link>
                                                <Link to="/products?category=Shoes" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_25d220710b5bedd4075e546ae389e3f1.jpg.jpeg" alt="Sneakers" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Sneakers</p>
                                                </Link>
                                                <Link to="/products?category=Bags & Luggage" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1447c9a341d4a0cb37663efd88317881.jpg.jpeg" alt="Handbags" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Handbags</p>
                                                </Link>
                                                <Link to="/products?category=Women" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_42b89e05b94646e2b8d09ad2df4d8169.jpg.jpeg" alt="Women Fashion" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Women Fashion</p>
                                                </Link>
                                                <Link to="/products?category=Men" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_0f2565000bdfaa140f46fa3cfa2d1f4b.jpg.jpeg" alt="Men Style" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Men's Style</p>
                                                </Link>
                                                <Link to="/products?category=Jewelry & Accessories" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_25d220710b5bedd4075e546ae389e3f1.jpg.jpeg" alt="Accessories" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Accessories</p>
                                                </Link>
                                                <Link to="/products?category=Beauty & Health" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1ea23752a1751fa69f5f14fb8bcdc372.jpg.jpeg" alt="Cosmetics" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Cosmetics</p>
                                                </Link>
                                                <Link to="/products?category=Bottoms" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_3b04ad8a2ffd638d432292fb58b6b481.jpg.jpeg" alt="Pants" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Pants</p>
                                                </Link>
                                                <Link to="/products?category=Denim" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_42b89e05b94646e2b8d09ad2df4d8169.jpg.jpeg" alt="Jeans" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Jeans</p>
                                                </Link>
                                                <Link to="/products?category=Home & Living" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_106e1631e02d6e9b50eed28f374e79d7.jpg.jpeg" alt="Decor" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Home Decor</p>
                                                </Link>
                                                <Link to="/products?category=Sports & Outdoor" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_177e205382cdd5390bdc6be5a8283dc6.jpg.jpeg" alt="Athletic" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Athletic</p>
                                                </Link>
                                                <Link to="/products?category=Kids" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_3cc73f2c1b54d0e5823553608b03a2eb.jpg.jpeg" alt="Kids Fashion" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Kids Fashion</p>
                                                </Link>
                                                <Link to="/products?category=Curve" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_00fd72eb0b77844eaebd4c1f1e5486f5.jpg.jpeg" alt="Plus Size" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Plus Size</p>
                                                </Link>
                                                <Link to="/products?category=Underwear & Sleepwear" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_077da0a9225e1f657bfa92fede15526a.jpg.jpeg" alt="Intimates" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Intimates</p>
                                                </Link>
                                                <Link to="/products?category=Cell Phones & Accessories" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1447c9a341d4a0cb37663efd88317881.jpg.jpeg" alt="Electronics" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Electronics</p>
                                                </Link>
                                                <Link to="/products?category=Co-ords" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_0f2565000bdfaa140f46fa3cfa2d1f4b.jpg.jpeg" alt="Matching Sets" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Matching Sets</p>
                                                </Link>
                                                <Link to="/products?category=Jumpsuits & Bodysuits" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1ea23752a1751fa69f5f14fb8bcdc372.jpg.jpeg" alt="Rompers" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Rompers</p>
                                                </Link>
                                                <Link to="/products?category=Office & School Supplies" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_25d220710b5bedd4075e546ae389e3f1.jpg.jpeg" alt="Stationery" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Stationery</p>
                                                </Link>
                                                <Link to="/products?category=Automotive" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_3cc73f2c1b54d0e5823553608b03a2eb.jpg.jpeg" alt="Car Accessories" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Car Accessories</p>
                                                </Link>
                                                <Link to="/products?category=Baby & Maternity" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_08be20a33e3de81f897b9a1e6ac44eb3.jpg.jpeg" alt="Maternity" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Maternity</p>
                                                </Link>
                                                <Link to="/products?category=Pet Supplies" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_177e205382cdd5390bdc6be5a8283dc6.jpg.jpeg" alt="Pet Care" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Pet Care</p>
                                                </Link>
                                                <Link to="/products?category=Fall & Winter" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1ea23752a1751fa69f5f14fb8bcdc372.jpg.jpeg" alt="Outerwear" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Outerwear</p>
                                                </Link>
                                                <Link to="/products?category=Customization" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_106e1631e02d6e9b50eed28f374e79d7.jpg.jpeg" alt="Personalized" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Personalized</p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative group h-full flex items-center">
                            <Link to="/orders" className="hover:text-black dark:hover:text-white transition flex items-center gap-2 h-full">
                                <ShieldCheck className="w-4 h-4 text-orange-500" />
                                <span>Order protections</span>
                            </Link>

                            {/* Trade Assurance Dropdown */}
                            <div className="hidden group-hover:block absolute left-0 top-full pt-2 w-[1100px] z-50 animate-fade-in-up">
                                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 p-10 flex gap-12">
                                    {/* Left Side: Hero Info */}
                                    <div className="w-1/3 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-6">
                                            <ShieldCheck className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                                            <span className="font-bold text-2xl text-gray-900 dark:text-white">Trade Assurance</span>
                                        </div>
                                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                            Enjoy protection from payment to delivery
                                        </h3>
                                        <Link to="/orders" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg text-center transition w-fit">
                                            Learn more
                                        </Link>
                                    </div>

                                    {/* Right Side: Features Grid */}
                                    <div className="flex-1 grid grid-cols-2 gap-6">
                                        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl flex items-center gap-5 hover:bg-gray-100 dark:hover:bg-white/10 transition group/item cursor-pointer">
                                            <div className="w-14 h-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                                <Shield className="w-7 h-7" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 dark:text-white text-lg">Safe & easy payments</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover/item:text-orange-500 transition" />
                                        </div>

                                        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl flex items-center gap-5 hover:bg-gray-100 dark:hover:bg-white/10 transition group/item cursor-pointer">
                                            <div className="w-14 h-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                                <RefreshCcw className="w-7 h-7" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 dark:text-white text-lg">Money-back policy</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover/item:text-orange-500 transition" />
                                        </div>

                                        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl flex items-center gap-5 hover:bg-gray-100 dark:hover:bg-white/10 transition group/item cursor-pointer">
                                            <div className="w-14 h-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                                <Ship className="w-7 h-7" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 dark:text-white text-lg">Shipping & logistics services</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover/item:text-orange-500 transition" />
                                        </div>

                                        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl flex items-center gap-5 hover:bg-gray-100 dark:hover:bg-white/10 transition group/item cursor-pointer">
                                            <div className="w-14 h-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                                <Wrench className="w-7 h-7" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 dark:text-white text-lg">After-sales protections</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover/item:text-orange-500 transition" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </nav >

            {/* Mobile Search Overlay */}
            {
                showMobileSearch && (
                    <div className="fixed inset-0 z-[100] md:hidden">
                        {/* Backdrop - Click anywhere to close */}
                        <div
                            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] animate-fade-in"
                            onClick={() => setShowMobileSearch(false)}
                        />

                        {/* Search Bar Container */}
                        <div className="absolute top-20 left-0 w-full bg-white dark:bg-[#1a1a1a] p-4 border-b border-gray-100 dark:border-white/10 shadow-xl animate-fade-in-up">
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="text"
                                    placeholder={t('nav_search_placeholder')}
                                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-full py-2.5 px-6 focus:ring-2 focus:ring-shein-red focus:bg-white dark:focus:bg-black transition-all text-sm placeholder-gray-400 text-black dark:text-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    autoFocus
                                />
                                <button onClick={handleSearch} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-shein-red transition">
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Mobile Menu Overlay - OUTSIDE NAV TO AVOID Z-INDEX CLAMPING */}
            {
                isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[9999] md:hidden">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setIsMobileMenuOpen(false)} />

                        {/* Drawer Content */}
                        <div className="absolute inset-x-0 bottom-0 bg-white dark:bg-[#121212] shadow-2xl flex flex-col h-[85vh] rounded-t-[2.5rem] animate-slide-up border-t border-white/10 overflow-hidden">
                            {/* Visual Handle for Bottom Sheet */}
                            <div className="pt-3 pb-1 flex justify-center cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                                <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full" />
                            </div>

                            {/* Header */}
                            <div className="flex justify-between items-center px-6 py-5 border-b dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/shop-corner-final-logo.png"
                                        alt="Shop Corner"
                                        className="w-11 h-11 object-cover rounded-lg shadow-sm"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-black text-lg dark:text-white tracking-tight leading-none uppercase">SHOP<span className="text-shein-red">CORNER</span></span>
                                        <span className="text-[10px] font-black tracking-[0.2em] text-shein-red mt-0.5">RWANDA</span>
                                    </div>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10 rounded-full transition shadow-sm">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Tab Switcher */}
                            <div className="flex border-b dark:border-white/10">
                                <button
                                    onClick={() => setDrawerTab('categories')}
                                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${drawerTab === 'categories' ? 'text-shein-red border-b-2 border-shein-red bg-shein-red/5' : 'text-gray-400 dark:text-gray-500'}`}
                                >
                                    Categories
                                </button>
                                <button
                                    onClick={() => setDrawerTab('general')}
                                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${drawerTab === 'general' ? 'text-shein-red border-b-2 border-shein-red bg-shein-red/5' : 'text-gray-400 dark:text-gray-500'}`}
                                >
                                    Menu
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 overflow-y-auto">
                                {drawerTab === 'categories' ? (
                                    /* CATEGORIES TAB */
                                    <div className="p-4 animate-fade-in">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Shop By Category</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Sale', 'Clothing', 'Dresses', 'Tops', 'Beachwear', 'Shoes', 'Home & Pets'].map(cat => (
                                                <Link
                                                    key={cat}
                                                    to="/products"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-md text-[11px] font-bold text-black dark:text-white hover:border-shein-red hover:text-shein-red transition-all flex items-center justify-center text-center capitalize"
                                                >
                                                    {cat}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    /* GENERAL MENU TAB */
                                    <div className="animate-fade-in">
                                        <div className="py-2">
                                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-bold uppercase tracking-wide border-b border-gray-50 dark:border-white/5">
                                                {t('nav_home')}
                                            </Link>
                                            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-bold uppercase tracking-wide border-b border-gray-50 dark:border-white/5">
                                                {t('nav_products')}
                                            </Link>
                                            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium border-b border-gray-50 dark:border-white/5">
                                                {t('nav_about')}
                                            </Link>
                                            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium border-b border-gray-50 dark:border-white/5">
                                                <MessageCircle className="w-5 h-5 mr-3 opacity-70" /> {t('nav_contact')}
                                            </Link>
                                            <Link to="/returns" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium border-b border-gray-50 dark:border-white/5">
                                                Returns
                                            </Link>
                                        </div>

                                        <div className="py-2 bg-gray-50/30 dark:bg-white/5">
                                            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-6 py-3.5 hover:bg-gray-100 dark:hover:bg-white/10 text-sm font-medium">
                                                <ShoppingBag className="w-5 h-5 mr-3 opacity-70" /> Cart
                                                {cartCount > 0 && <span className="ml-auto bg-shein-red text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{cartCount}</span>}
                                            </Link>
                                            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-6 py-3.5 hover:bg-gray-100 dark:hover:bg-white/10 text-sm font-medium">
                                                <Heart className="w-5 h-5 mr-3 opacity-70" /> Wishlist
                                                {wishlist.length > 0 && <span className="ml-auto bg-gray-400 text-white text-[10px] px-2 py-0.5 rounded-full">{wishlist.length}</span>}
                                            </Link>
                                        </div>

                                        <div className="border-t dark:border-white/10 mt-4 mb-8">
                                            {user ? (
                                                <div className="px-6 py-4">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Account Settings</p>
                                                    <div className="space-y-4">
                                                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-sm font-medium hover:text-shein-red transition-colors">
                                                            <User className="w-5 h-5 mr-3" /> My Profile
                                                        </Link>
                                                        <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-sm font-medium hover:text-shein-red transition-colors">
                                                            <Package className="w-5 h-5 mr-3" /> Orders
                                                        </Link>
                                                        <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center text-sm font-bold text-red-600 dark:text-red-500 hover:opacity-70 transition-opacity">
                                                            <LogOut className="w-5 h-5 mr-3" /> Logout
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-6">
                                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center bg-black dark:bg-shein-red text-white py-4 rounded-md text-xs font-black uppercase tracking-[0.2em] active:scale-95 transition-transform">
                                                        Sign In / Join Now
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default Navbar;

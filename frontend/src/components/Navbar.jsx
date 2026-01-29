import { Search, ShoppingBag, Heart, User, LogOut, LayoutDashboard, Globe, MessageCircle, Package, Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
                <div className="bg-[#1a1a1a] dark:bg-black text-[10px] md:text-xs">
                    <div className="container mx-auto px-4 h-9 flex items-center justify-between text-gray-300">
                        <div className="flex items-center justify-between w-full max-w-sm md:max-w-none md:justify-start md:space-x-12">
                            <Link to="/" className="hover:text-white transition uppercase tracking-tighter md:tracking-wider whitespace-nowrap text-[8px] xs:text-[10px] md:text-xs">{t('nav_home')}</Link>
                            <Link to="/products" className="hover:text-white transition uppercase tracking-tighter md:tracking-wider whitespace-nowrap text-[8px] xs:text-[10px] md:text-xs">{t('nav_products')}</Link>
                            <Link to="/about" className="hover:text-white transition uppercase tracking-tighter md:tracking-wider whitespace-nowrap text-[8px] xs:text-[10px] md:text-xs">{t('nav_about')}</Link>
                            <Link to="/contact" className="hover:text-white transition uppercase tracking-tighter md:tracking-wider whitespace-nowrap text-[8px] xs:text-[10px] md:text-xs">{t('nav_contact')}</Link>
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

                {/* Row 3: Sub Navigation */}
                <div className="border-t border-gray-100 dark:border-white/10 bg-white dark:bg-black/50">
                    <div className="container mx-auto px-4 h-12 flex items-center overflow-x-auto no-scrollbar gap-8 text-sm font-medium text-black dark:text-gray-200 uppercase tracking-wide">
                        <Link to="/products" className="text-red-500 hover:text-red-600 flex-shrink-0">{t('nav_products')}</Link>
                        <Link to="/products" className="hover:text-gray-600 dark:hover:text-white flex-shrink-0">Sale</Link>
                        <Link to="/products" className="hover:text-gray-600 dark:hover:text-white flex-shrink-0">Clothing</Link>
                        <Link to="/products" className="hover:text-gray-600 dark:hover:text-white flex-shrink-0">Dresses</Link>
                        <Link to="/products" className="hover:text-gray-600 dark:hover:text-white flex-shrink-0">Tops</Link>
                        <Link to="/products" className="hover:text-gray-600 dark:hover:text-white flex-shrink-0">Beachwear</Link>
                        <Link to="/products" className="hover:text-gray-600 dark:hover:text-white flex-shrink-0">Shoes</Link>
                        <Link to="/products" className="hover:text-gray-600 dark:hover:text-white flex-shrink-0">Home & Pets</Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Search Overlay */}
            {showMobileSearch && (
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
            )}

            {/* Mobile Menu Overlay - OUTSIDE NAV TO AVOID Z-INDEX CLAMPING */}
            {isMobileMenuOpen && (
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
            )}
        </>
    );
};

export default Navbar;

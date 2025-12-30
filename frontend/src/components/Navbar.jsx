import { Search, ShoppingBag, Heart, User, LogOut, LayoutDashboard, Globe, MessageCircle, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm font-sans">
            {/* Row 1: Top Bar (Black) - Mocking the top strip */}
            <div className="bg-gray-100 text-xs border-b border-gray-200">
                <div className="container mx-auto px-4 h-8 flex items-center justify-between text-gray-600">
                    <div className="flex space-x-4">
                        <span className="hover:text-black cursor-pointer">Women</span>
                        <span className="hover:text-black cursor-pointer">Men</span>
                        <span className="hover:text-black cursor-pointer">Kids</span>
                        <span className="hover:text-black cursor-pointer">Home</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="hover:text-black cursor-pointer">Support</span>
                        <span className="hover:text-black cursor-pointer flex items-center"><Globe className="w-3 h-3 mr-1" /> US/USD</span>
                    </div>
                </div>
            </div>

            {/* Row 2: Main Header */}
            <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-8 h-20">
                <Link to="/" className="flex items-center gap-3 flex-shrink-0 group no-underline">
                    <img src="/logo-icon.png" alt="Shop Corner Rwanda" className="h-14 w-auto object-contain transition-transform group-hover:scale-105" />
                    <div className="flex flex-col items-start leading-none pointer-events-none">
                        <span className="text-xl md:text-2xl font-black text-black tracking-tight">
                            SHOP CORNER RWANDA
                        </span>
                        <span className="text-[0.65rem] md:text-[0.7rem] font-bold text-gray-500 tracking-[0.25em] uppercase mt-1 w-full text-justify">
                            Your Everyday Shop Stop
                        </span>
                    </div>
                </Link>

                {/* Search Bar - Center */}
                <div className="hidden md:flex flex-1 max-w-2xl relative">
                    <input
                        type="text"
                        placeholder="Search for items, brands and inspiration..."
                        className="w-full border-2 border-black rounded-r-none rounded-l-md py-2.5 px-4 focus:outline-none text-sm placeholder-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-black text-white px-6 rounded-r-md hover:bg-gray-800 transition flex items-center justify-center"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {/* Icons */}
                <div className="flex items-center space-x-6 text-black">
                    {/* User */}
                    <div className="relative group">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center hover:text-gray-600 transition"
                                >
                                    <User className="h-6 w-6 stroke-1" />
                                </button>
                                {/* User Dropdown */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded shadow-lg py-1 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-bold truncate">Hi, {user.name}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                                        >
                                            <User className="w-4 h-4 mr-2" /> My Profile
                                        </Link>
                                        <Link
                                            to="/orders"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                                        >
                                            <Package className="w-4 h-4 mr-2" /> My Orders
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                                            >
                                                <LayoutDashboard className="w-4 h-4 mr-2" /> Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-left text-red-600"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="hover:text-gray-600 transition">
                                <User className="h-6 w-6 stroke-1" />
                            </Link>
                        )}
                    </div>

                    {/* Wishlist */}
                    <Link to="/wishlist" className="relative hover:text-gray-600 transition">
                        <Heart className="h-6 w-6 stroke-1" />
                        {wishlist.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                {wishlist.length}
                            </span>
                        )}
                    </Link>

                    {/* Cart */}
                    <Link to="/cart" className="hover:text-gray-600 transition relative">
                        <ShoppingBag className="h-6 w-6 stroke-1" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Row 3: Sub Navigation */}
            <div className="border-t border-gray-100 bg-white">
                <div className="container mx-auto px-4 h-12 flex items-center overflow-x-auto no-scrollbar gap-8 text-sm font-medium text-black uppercase tracking-wide">
                    <Link to="/products" className="text-red-500 hover:text-red-600 flex-shrink-0">New In</Link>
                    <Link to="/products" className="hover:text-gray-600 flex-shrink-0">Sale</Link>
                    <Link to="/products" className="hover:text-gray-600 flex-shrink-0">Clothing</Link>
                    <Link to="/products" className="hover:text-gray-600 flex-shrink-0">Dresses</Link>
                    <Link to="/products" className="hover:text-gray-600 flex-shrink-0">Tops</Link>
                    <Link to="/products" className="hover:text-gray-600 flex-shrink-0">Beachwear</Link>
                    <Link to="/products" className="hover:text-gray-600 flex-shrink-0">Shoes</Link>
                    <Link to="/products" className="hover:text-gray-600 flex-shrink-0">Home & Pets</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

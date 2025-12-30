import { Search, ShoppingBag, Heart, User, LogOut, LayoutDashboard, Globe, MessageCircle, Package, Menu, X } from 'lucide-react';
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4 md:gap-8 h-20">
                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-black p-2"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </button>

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
                    {/* User - Hidden on Mobile, moved to Drawer */}
                    <div className="relative group hidden md:block">
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

                    {/* Wishlist - Hidden on Mobile, moved to Drawer */}
                    <Link to="/wishlist" className="relative hover:text-gray-600 transition hidden md:block">
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


            {/* Mobile Menu Overlay */}
            {
                isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[60] bg-black/50 md:hidden">
                        <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-xl flex flex-col h-full animate-slide-in-left">
                            {/* Header */}
                            <div className="flex justify-between items-center p-4 border-b">
                                <span className="font-bold text-lg">Menu</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Search Mobile */}
                            <div className="p-4 border-b">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full border p-2 pl-3 pr-10 rounded text-sm bg-gray-50 focus:outline-none focus:border-black"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch();
                                                setIsMobileMenuOpen(false);
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            handleSearch();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="absolute right-0 top-0 h-full px-3 text-gray-500"
                                    >
                                        <Search className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 overflow-y-auto py-2">
                                <div className="space-y-1">
                                    <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 hover:bg-gray-50 font-medium">New In</Link>
                                    <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 hover:bg-gray-50 font-medium text-red-500">Sale</Link>
                                    <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 hover:bg-gray-50 font-medium">Clothing</Link>
                                    <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 hover:bg-gray-50 font-medium">Shoes</Link>
                                    <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 hover:bg-gray-50 font-medium">Home & Living</Link>
                                    <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 hover:bg-gray-50 font-medium">Home & Living</Link>
                                </div>

                                <div className="border-t my-2 pt-2 space-y-1">
                                    {/* Mobile Wishlist & Cart Links */}
                                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-6 py-3 hover:bg-gray-50 font-medium text-gray-700">
                                        <Heart className="w-5 h-5 mr-3" /> Wishlist
                                        {wishlist.length > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlist.length}</span>}
                                    </Link>
                                    <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-6 py-3 hover:bg-gray-50 font-medium text-gray-700">
                                        <ShoppingBag className="w-5 h-5 mr-3" /> Cart
                                        {cartCount > 0 && <span className="ml-auto bg-black text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>}
                                    </Link>
                                </div>

                                <div className="border-t my-2 pt-2">
                                    {user ? (
                                        <>
                                            <div className="px-6 py-2 text-sm text-gray-400 font-bold uppercase tracking-wider">Account</div>
                                            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 hover:bg-gray-50">My Profile</Link>
                                            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 hover:bg-gray-50">My Orders</Link>
                                            <button onClick={handleLogout} className="block w-full text-left px-6 py-3 text-red-600 hover:bg-gray-50">Logout</button>
                                        </>
                                    ) : (
                                        <div className="p-4">
                                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center bg-black text-white py-3 rounded font-bold">Sign In / Register</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;

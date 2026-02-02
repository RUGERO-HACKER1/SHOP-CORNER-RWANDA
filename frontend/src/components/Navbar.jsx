import { Search, ShoppingBag, Heart, User, LogOut, LayoutDashboard, MessageCircle, Package, Menu, X, Shirt, UserCircle, Baby, Users, Sparkles, Footprints, ShoppingCart, Gem, Palette, Smartphone, Home, BookOpen, Bike, PawPrint, Car, CloudSnow, Wand2, Scissors, Columns, Layers, Component, Copy } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();
    const { t } = useLanguage();
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
            <nav className="sticky top-0 z-50 bg-white shadow-sm font-sans transition-all duration-300">

                {/* Row 2: Main Header */}
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    {/* LEFT: Menu Button & Logo */}
                    <div className="flex items-center gap-2 md:gap-4 flex-1">
                        <button
                            className="md:hidden text-black p-2 hover:bg-gray-100 rounded-full transition relative z-[60]"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMobileMenuOpen(true);
                            }}
                            aria-label="Open Menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Desktop Mega Menu */}
                        <div className="hidden md:flex relative group h-full items-center mr-1">
                            <button className="flex items-center justify-center hover:bg-gray-100 w-10 h-10 rounded-full transition text-sm font-bold">
                                <Menu className="w-5 h-5" />
                            </button>

                            {/* Mega Menu Dropdown */}
                            <div className="hidden group-hover:block absolute left-0 top-full w-[1300px] bg-white shadow-2xl border border-gray-200 rounded-2xl z-50 mt-2">
                                <div className="flex">
                                    {/* Left Sidebar - Category List */}
                                    <div className="w-80 border-r border-gray-200 p-6 bg-gray-50 rounded-bl-2xl">
                                        <h3 className="text-base font-bold text-gray-500 mb-6">{t('nav_cat_header')}</h3>
                                        <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
                                            <Link to="/products?category=Women" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Users className="w-6 h-6" />
                                                <span>{t('cat_women')}</span>
                                            </Link>
                                            <Link to="/products?category=Men" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <UserCircle className="w-6 h-6" />
                                                <span>{t('cat_men')}</span>
                                            </Link>
                                            <Link to="/products?category=Kids" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Baby className="w-6 h-6" />
                                                <span>{t('cat_kids')}</span>
                                            </Link>
                                            <Link to="/products?category=Curve" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Sparkles className="w-6 h-6" />
                                                <span>{t('cat_curve')}</span>
                                            </Link>
                                            <Link to="/products?category=Dresses" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Scissors className="w-6 h-6" />
                                                <span>{t('cat_dresses')}</span>
                                            </Link>
                                            <Link to="/products?category=Tops" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Shirt className="w-6 h-6" />
                                                <span>{t('cat_tops')}</span>
                                            </Link>
                                            <Link to="/products?category=Bottoms" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Columns className="w-6 h-6" />
                                                <span>{t('cat_bottoms')}</span>
                                            </Link>
                                            <Link to="/products?category=Denim" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Layers className="w-6 h-6" />
                                                <span>{t('cat_denim')}</span>
                                            </Link>
                                            <Link to="/products?category=Jumpsuits & Bodysuits" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Component className="w-6 h-6" />
                                                <span>{t('cat_jumpsuits')}</span>
                                            </Link>
                                            <Link to="/products?category=Co-ords" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Copy className="w-6 h-6" />
                                                <span>{t('cat_coords')}</span>
                                            </Link>
                                            <Link to="/products?category=Underwear & Sleepwear" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Heart className="w-6 h-6" />
                                                <span>{t('cat_underwear')}</span>
                                            </Link>
                                            <Link to="/products?category=Shoes" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Footprints className="w-6 h-6" />
                                                <span>{t('cat_shoes')}</span>
                                            </Link>
                                            <Link to="/products?category=Bags & Luggage" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <ShoppingCart className="w-6 h-6" />
                                                <span>{t('cat_bags')}</span>
                                            </Link>
                                            <Link to="/products?category=Jewelry & Accessories" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Gem className="w-6 h-6" />
                                                <span>{t('cat_accessories')}</span>
                                            </Link>
                                            <Link to="/products?category=Beauty & Health" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Palette className="w-6 h-6" />
                                                <span>{t('cat_beauty')}</span>
                                            </Link>
                                            <Link to="/products?category=Cell Phones & Accessories" className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-lg transition">
                                                <Smartphone className="w-6 h-6" />
                                                <span>{t('cat_electronics')}</span>
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
                                        <h3 className="text-sm font-bold text-gray-700 mb-4">Categories for you</h3>
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
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_electronics')}</p>
                                                </Link>
                                                <Link to="/products?category=Beauty & Health" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_00fd72eb0b77844eaebd4c1f1e5486f5.jpg.jpeg" alt="Beauty" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_beauty')}</p>
                                                </Link>
                                                <Link to="/products?category=Home & Living" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1ea23752a1751fa69f5f14fb8bcdc372.jpg.jpeg" alt="Home" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_home')}</p>
                                                </Link>
                                                <Link to="/products?category=Office & School Supplies" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_106e1631e02d6e9b50eed28f374e79d7.jpg.jpeg" alt="Office" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_office')}</p>
                                                </Link>
                                                <Link to="/products?category=Jumpsuits & Bodysuits" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_42b89e05b94646e2b8d09ad2df4d8169.jpg.jpeg" alt="Jumpsuits" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_jumpsuits')}</p>
                                                </Link>
                                                <Link to="/products?category=Sports & Outdoor" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_3cc73f2c1b54d0e5823553608b03a2eb.jpg.jpeg" alt="Sports" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_sports')}</p>
                                                </Link>
                                                <Link to="/products?category=Automotive" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_177e205382cdd5390bdc6be5a8283dc6.jpg.jpeg" alt="Auto" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_auto')}</p>
                                                </Link>
                                                <Link to="/products?category=Baby & Maternity" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_106e1631e02d6e9b50eed28f374e79d7.jpg.jpeg" alt="Baby" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_baby')}</p>
                                                </Link>
                                                <Link to="/products?category=Pet Supplies" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_177e205382cdd5390bdc6be5a8283dc6.jpg.jpeg" alt="Pets" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_pets')}</p>
                                                </Link>
                                                <Link to="/products?category=Fall & Winter" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1ea23752a1751fa69f5f14fb8bcdc372.jpg.jpeg" alt="Winter" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Winter Wear</p>
                                                </Link>
                                                <Link to="/products?category=Customization" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_106e1631e02d6e9b50eed28f374e79d7.jpg.jpeg" alt="Custom" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Custom</p>
                                                </Link>
                                                {/* Row 2 - More variety */}
                                                <Link to="/products?category=Dresses" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_3b04ad8a2ffd638d432292fb58b6b481.jpg.jpeg" alt="Casual Dresses" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_dresses')}</p>
                                                </Link>
                                                <Link to="/products?category=Tops" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_00fd72eb0b77844eaebd4c1f1e5486f5.jpg.jpeg" alt="Blouses" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_tops')}</p>
                                                </Link>
                                                <Link to="/products?category=Shoes" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_25d220710b5bedd4075e546ae389e3f1.jpg.jpeg" alt="Sneakers" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_shoes')}</p>
                                                </Link>
                                                <Link to="/products?category=Bags & Luggage" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1447c9a341d4a0cb37663efd88317881.jpg.jpeg" alt="Handbags" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_bags')}</p>
                                                </Link>
                                                <Link to="/products?category=Women" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_42b89e05b94646e2b8d09ad2df4d8169.jpg.jpeg" alt="Women Fashion" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_women')}</p>
                                                </Link>
                                                <Link to="/products?category=Men" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_0f2565000bdfaa140f46fa3cfa2d1f4b.jpg.jpeg" alt="Men Style" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_men')}</p>
                                                </Link>
                                                <Link to="/products?category=Jewelry & Accessories" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_25d220710b5bedd4075e546ae389e3f1.jpg.jpeg" alt="Accessories" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_accessories')}</p>
                                                </Link>
                                                <Link to="/products?category=Beauty & Health" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1ea23752a1751fa69f5f14fb8bcdc372.jpg.jpeg" alt="Cosmetics" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_beauty')}</p>
                                                </Link>
                                                <Link to="/products?category=Bottoms" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_3b04ad8a2ffd638d432292fb58b6b481.jpg.jpeg" alt="Pants" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_bottoms')}</p>
                                                </Link>
                                                <Link to="/products?category=Denim" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_42b89e05b94646e2b8d09ad2df4d8169.jpg.jpeg" alt="Jeans" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_denim')}</p>
                                                </Link>
                                                <Link to="/products?category=Home & Living" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_106e1631e02d6e9b50eed28f374e79d7.jpg.jpeg" alt="Decor" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_home')}</p>
                                                </Link>
                                                <Link to="/products?category=Sports & Outdoor" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_177e205382cdd5390bdc6be5a8283dc6.jpg.jpeg" alt="Athletic" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_sports')}</p>
                                                </Link>
                                                <Link to="/products?category=Kids" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_3cc73f2c1b54d0e5823553608b03a2eb.jpg.jpeg" alt="Kids Fashion" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_kids')}</p>
                                                </Link>
                                                <Link to="/products?category=Curve" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_00fd72eb0b77844eaebd4c1f1e5486f5.jpg.jpeg" alt="Plus Size" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_curve')}</p>
                                                </Link>
                                                <Link to="/products?category=Underwear & Sleepwear" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_077da0a9225e1f657bfa92fede15526a.jpg.jpeg" alt="Intimates" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_underwear')}</p>
                                                </Link>
                                                <Link to="/products?category=Cell Phones & Accessories" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1447c9a341d4a0cb37663efd88317881.jpg.jpeg" alt="Electronics" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_electronics')}</p>
                                                </Link>
                                                <Link to="/products?category=Co-ords" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_0f2565000bdfaa140f46fa3cfa2d1f4b.jpg.jpeg" alt="Matching Sets" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_coords')}</p>
                                                </Link>
                                                <Link to="/products?category=Jumpsuits & Bodysuits" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1ea23752a1751fa69f5f14fb8bcdc372.jpg.jpeg" alt="Rompers" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_jumpsuits')}</p>
                                                </Link>
                                                <Link to="/products?category=Office & School Supplies" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_25d220710b5bedd4075e546ae389e3f1.jpg.jpeg" alt="Stationery" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_office')}</p>
                                                </Link>
                                                <Link to="/products?category=Automotive" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_3cc73f2c1b54d0e5823553608b03a2eb.jpg.jpeg" alt="Car Accessories" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_auto')}</p>
                                                </Link>
                                                <Link to="/products?category=Baby & Maternity" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_08be20a33e3de81f897b9a1e6ac44eb3.jpg.jpeg" alt="Maternity" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_baby')}</p>
                                                </Link>
                                                <Link to="/products?category=Pet Supplies" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_177e205382cdd5390bdc6be5a8283dc6.jpg.jpeg" alt="Pet Care" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('cat_pets')}</p>
                                                </Link>
                                                <Link to="/products?category=Fall & Winter" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1ea23752a1751fa69f5f14fb8bcdc372.jpg.jpeg" alt="Outerwear" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Outerwear</p>
                                                </Link>
                                                <Link to="/products?category=Customization" className="group/item text-center">
                                                    <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden group-hover/item:scale-105 transition shadow-sm">
                                                        <img src="/products/1688_image_share_1447c9a341d4a0cb37663efd88317881.jpg.jpeg" alt="Personalized" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Personalized</p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="/" className="flex items-center gap-1 group no-underline hover:opacity-90 transition">
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-2xl md:text-3xl font-black text-black tracking-tighter uppercase whitespace-nowrap">
                                    SHOP<span className="text-shein-red">CORNER</span>
                                </span>
                                <span className="block text-[10px] md:text-[11px] tracking-[0.36em] text-shein-red font-black mt-0.5 ml-1">RWANDA</span>
                            </div>
                        </Link>
                    </div>

                    {/* CENTER: Search (Desktop Only) */}
                    <div className="hidden md:flex flex-[2] max-w-xl relative group px-4">
                        <input
                            type="text"
                            placeholder={t('nav_search_placeholder')}
                            className="w-full bg-gray-50 border-none rounded-full py-2.5 px-6 focus:ring-2 focus:ring-shein-red focus:bg-white transition-all text-sm placeholder-gray-400 text-black"
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
                        <div className="flex md:hidden items-center space-x-1">
                            <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="p-2 text-black active:scale-95 transition">
                                <Search className="w-5 h-5 stroke-2" />
                            </button>
                            <Link to="/wishlist" className="p-2 text-black relative">
                                <Heart className="w-5 h-5 stroke-2" />
                                {wishlist.length > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Link>
                            <Link to="/cart" className="p-2 text-black relative">
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
                            <Link to="/cart" className="hover:text-gray-600 transition relative">
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
                            <Link to="/wishlist" className="relative hover:text-gray-600 transition">
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
                        <div className="absolute top-20 left-0 w-full bg-white p-4 border-b border-gray-100 shadow-xl animate-fade-in-up">
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="text"
                                    placeholder={t('nav_search_placeholder')}
                                    className="w-full bg-gray-50 border-none rounded-full py-2.5 px-6 focus:ring-2 focus:ring-shein-red focus:bg-white transition-all text-sm placeholder-gray-400 text-black"
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
                                    <div className="flex flex-col">
                                        <span className="font-black text-2xl dark:text-white tracking-tight leading-none uppercase">SHOP<span className="text-shein-red">CORNER</span></span>
                                        <span className="text-[10px] font-black tracking-[0.35em] text-shein-red mt-0.5 ml-0.5">RWANDA</span>
                                    </div>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10 rounded-full transition shadow-sm">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Menu Content */}
                            <div className="flex-1 overflow-y-auto animate-fade-in">
                                <div className="py-2">
                                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-6 py-4 hover:bg-gray-50 text-sm font-bold uppercase tracking-wide border-b border-gray-50">
                                        Home
                                    </Link>
                                    <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-6 py-4 hover:bg-gray-50 text-sm font-bold uppercase tracking-wide border-b border-gray-50">
                                        Products
                                    </Link>
                                </div>

                                {/* Mobile Category Grid */}
                                <div className="p-4 border-b border-gray-50 dark:border-white/5">
                                    <p className="px-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{t('nav_cat_header')}</p>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { name: t('cat_women'), img: "1688_image_share_42b89e05b94646e2b8d09ad2df4d8169.jpg.jpeg", link: "Women" },
                                            { name: t('cat_men'), img: "1688_image_share_08be20a33e3de81f897b9a1e6ac44eb3.jpg.jpeg", link: "Men" },
                                            { name: t('cat_kids'), img: "1688_image_share_08be20a33e3de81f897b9a1e6ac44eb3.jpg.jpeg", link: "Kids" },
                                            { name: t('cat_dresses'), img: "1688_image_share_42b89e05b94646e2b8d09ad2df4d8169.jpg.jpeg", link: "Dresses" },
                                            { name: t('cat_tops'), img: "1688_image_share_00fd72eb0b77844eaebd4c1f1e5486f5.jpg.jpeg", link: "Tops" },
                                            { name: t('cat_shoes'), img: "1688_image_share_25d220710b5bedd4075e546ae389e3f1.jpg.jpeg", link: "Shoes" },
                                            { name: t('cat_bags'), img: "1688_image_share_25d220710b5bedd4075e546ae389e3f1.jpg.jpeg", link: "Bags & Luggage" },
                                            { name: t('cat_beauty'), img: "1688_image_share_00fd72eb0b77844eaebd4c1f1e5486f5.jpg.jpeg", link: "Beauty & Health" },
                                            { name: t('cat_home'), img: "1688_image_share_1ea23752a1751fa69f5f14fb8bcdc372.jpg.jpeg", link: "Home & Living" }
                                        ].map((item, index) => (
                                            <Link key={index} to={`/products?category=${item.link}`} onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center group">
                                                <div className="w-full aspect-square mb-2 rounded-2xl overflow-hidden shadow-sm group-hover:scale-95 transition-transform bg-gray-100 dark:bg-white/5">
                                                    <img src={`/products/${item.img}`} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-[10px] font-bold text-center text-gray-700 dark:text-gray-300 leading-tight">{item.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="mt-6 text-center">
                                        <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="inline-block px-6 py-2 bg-gray-100 dark:bg-white/10 rounded-full text-xs font-black text-black dark:text-white uppercase tracking-widest hover:bg-shein-red hover:text-white transition-colors">
                                            {t('nav_all_cats')}
                                        </Link>
                                    </div>
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
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default Navbar;

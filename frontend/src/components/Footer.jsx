import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-black text-gray-900 dark:text-white pt-20 pb-10 mt-20 transition-colors border-t border-gray-100 dark:border-white/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Company Info */}
                    <div>
                        <h3 className="font-black uppercase tracking-widest text-sm mb-8 text-gray-400 dark:text-white/50">Company Info</h3>
                        <ul className="space-y-4 text-gray-600 dark:text-gray-400 text-sm">
                            <li><Link to="/about" className="hover:text-black dark:hover:text-white transition-colors">About Shop Corner</Link></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Social Responsibility</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Supply Chain</a></li>
                        </ul>
                    </div>

                    {/* Help & Support */}
                    <div>
                        <h3 className="font-black uppercase tracking-widest text-sm mb-8 text-gray-400 dark:text-white/50">Help & Support</h3>
                        <ul className="space-y-4 text-gray-600 dark:text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Shipping Info</a></li>
                            <li><Link to="/returns" className="hover:text-black dark:hover:text-white transition-colors">Returns</Link></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">How to Order</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Size Guide</a></li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h3 className="font-black uppercase tracking-widest text-sm mb-8 text-gray-400 dark:text-white/50">Customer Care</h3>
                        <ul className="space-y-4 text-gray-600 dark:text-gray-400 text-sm">
                            <li><Link to="/contact" className="hover:text-black dark:hover:text-white transition-colors">Contact Us</Link></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Payment Methods</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Bonus Point</a></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="font-black uppercase tracking-widest text-sm mb-8 text-gray-400 dark:text-white/50">Join Our World</h3>
                        <div className="flex space-x-6 mb-8">
                            <a href="#" className="text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-transform hover:-translate-y-1"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-transform hover:-translate-y-1"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-transform hover:-translate-y-1"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-transform hover:-translate-y-1"><Youtube className="w-5 h-5" /></a>
                        </div>
                        <div className="relative">
                            <input type="email" placeholder="Email Address" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white/30 text-gray-900 dark:text-white" />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase px-4 py-2 rounded-full hover:bg-shein-red dark:hover:bg-shein-red hover:text-white transition-colors">Join</button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
                        <div className="flex flex-col items-center md:items-start mb-4">
                            <img src="/shop-corner-final-logo.png" alt="Shop Corner" className="w-16 h-16 object-cover mb-3 rounded-lg shadow-sm" />
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap text-gray-900 dark:text-white">SHOP<span className="text-shein-red">CORNER</span></span>
                                <span className="text-[10px] font-black tracking-[0.3em] text-shein-red">RWANDA</span>
                            </div>
                        </div>
                        <p className="text-gray-400 dark:text-white/30 text-[10px] uppercase tracking-widest">
                            © 2026 Shop Corner Rwanda. All Rights Reserved.
                        </p>
                    </div>
                    <div className="flex space-x-6 items-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

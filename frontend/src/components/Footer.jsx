import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import { Link } from 'react-router-dom'; // Added import

const Footer = () => {
    return (
        <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Company Info */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Company Info</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li><Link to="/about" className="hover:text-black">About Shop Corner</Link></li>
                            <li><a href="#" className="hover:text-black">Social Responsibility</a></li>
                            <li><a href="#" className="hover:text-black">Careers</a></li>
                            <li><a href="#" className="hover:text-black">Supply Chain</a></li>
                        </ul>
                    </div>

                    {/* Help & Support */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Help & Support</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li><a href="#" className="hover:text-black">Shipping Info</a></li>
                            <li><Link to="/returns" className="hover:text-black">Returns</Link></li>
                            <li><a href="#" className="hover:text-black">How to Order</a></li>
                            <li><a href="#" className="hover:text-black">Size Guide</a></li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Customer Care</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li><Link to="/contact" className="hover:text-black">Contact Us</Link></li>
                            <li><a href="#" className="hover:text-black">Payment Methods</a></li>
                            <li><a href="#" className="hover:text-black">Bonus Point</a></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
                        <div className="flex space-x-4 mb-6">
                            <a href="#" className="text-gray-400 hover:text-black"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-black"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-black"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-black"><Youtube className="w-5 h-5" /></a>
                        </div>
                        <p className="text-gray-500 text-xs">
                            Sign up for our newsletter to get updates on new arrivals and sales.
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-xs mb-4 md:mb-0">
                        © 2024 Shop Corner Rwanda. All Rights Reserved.
                    </p>
                    <div className="flex space-x-4">
                        {/* Payment Icons placehoder */}
                        <div className="h-6 w-10 bg-gray-200 rounded"></div>
                        <div className="h-6 w-10 bg-gray-200 rounded"></div>
                        <div className="h-6 w-10 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

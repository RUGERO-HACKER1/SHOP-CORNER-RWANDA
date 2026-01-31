import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-white dark:bg-black text-gray-900 dark:text-white pt-20 pb-10 mt-20 transition-colors border-t border-gray-100 dark:border-white/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Company Info */}
                    <div>
                        <h3 className="font-bold text-sm mb-4 uppercase tracking-widest">{t('footer_company')}</h3>
                        <ul className="space-y-2 text-xs md:text-sm text-gray-400">
                            <li className="hover:text-white transition cursor-pointer">{t('footer_about')}</li>
                            <li className="hover:text-white transition cursor-pointer">{t('footer_social')}</li>
                            <li className="hover:text-white transition cursor-pointer">{t('footer_careers')}</li>
                            <li className="hover:text-white transition cursor-pointer">{t('footer_supply')}</li>
                        </ul>
                    </div>

                    {/* Help & Support */}
                    <div>
                        <h3 className="font-bold text-sm mb-4 uppercase tracking-widest">{t('footer_help')}</h3>
                        <ul className="space-y-2 text-xs md:text-sm text-gray-400">
                            <li className="hover:text-white transition cursor-pointer">{t('footer_shipping')}</li>
                            <li className="hover:text-white transition cursor-pointer">{t('footer_returns')}</li>
                            <li className="hover:text-white transition cursor-pointer">{t('footer_order')}</li>
                            <li className="hover:text-white transition cursor-pointer">{t('footer_size')}</li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h3 className="font-bold text-sm mb-4 uppercase tracking-widest">{t('footer_care')}</h3>
                        <ul className="space-y-2 text-xs md:text-sm text-gray-400">
                            <li className="hover:text-white transition cursor-pointer">{t('footer_contact')}</li>
                            <li className="hover:text-white transition cursor-pointer">{t('footer_payment')}</li>
                            <li className="hover:text-white transition cursor-pointer">{t('footer_bonus')}</li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="md:col-span-1">
                        <h3 className="font-bold text-sm mb-4 uppercase tracking-widest">{t('footer_join')}</h3>
                        <div className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder={t('footer_email_placeholder')}
                                className="bg-gray-100 dark:bg-white/10 dark:text-white px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-white transition-colors w-full border border-transparent dark:border-white/5"
                            />
                            <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 text-sm font-bold uppercase hover:bg-gray-800 dark:hover:bg-gray-200 transition w-full">
                                {t('footer_join_btn')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
                        <div className="flex flex-col items-center md:items-start mb-4">
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap text-gray-900 dark:text-white">SHOP<span className="text-shein-red">CORNER</span></span>
                                <span className="text-xs font-black tracking-[0.35em] text-shein-red ml-0.5">RWANDA</span>
                            </div>
                        </div>
                        <p className="text-gray-400 dark:text-white/30 text-[10px] uppercase tracking-widest">
                            <p className="order-2 md:order-1">&copy; {new Date().getFullYear()} Shop Corner Rwanda. {t('footer_rights')}</p>
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

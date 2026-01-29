import { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en';
import { rw } from '../locales/rw';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const translations = language === 'en' ? en : rw;

    const t = (key) => {
        return translations[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
    const phoneNumber = '250785617178'; // WhatsApp number without plus sign
    const message = encodeURIComponent("Hello Shop Corner, I'd like to chat about a product.");
    const href = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 left-4 md:bottom-8 md:left-8 z-[2000] flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-transform duration-150 active:scale-95"
        >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden md:inline text-sm font-bold tracking-wide">
                Chat on WhatsApp
            </span>
        </a>
    );
};

export default WhatsAppButton;


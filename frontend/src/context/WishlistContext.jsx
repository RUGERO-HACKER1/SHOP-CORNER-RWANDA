import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]); // Default empty for guests
    const { addToast } = useToast();

    // Load wishlist when user logs in
    useEffect(() => {
        if (user) {
            const saved = localStorage.getItem(`wishlist_${user.id}`);
            if (saved) {
                setWishlist(JSON.parse(saved));
            } else {
                setWishlist([]);
            }
        } else {
            setWishlist([]); // Clear for guest on load/refresh logic
        }
    }, [user]);

    // Save wishlist (User only)
    useEffect(() => {
        if (user) {
            localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
        }
    }, [wishlist, user]);

    const addToWishlist = (product) => {
        setWishlist(prev => {
            if (prev.find(item => item.id === product.id)) {
                addToast("Item already in wishlist", "info");
                return prev;
            }
            addToast("Added to wishlist", "success");
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id) => {
        setWishlist(prev => prev.filter(item => item.id !== id));
        addToast("Removed from wishlist", "info");
    };

    const isInWishlist = (id) => {
        return !!wishlist.find(item => item.id === id);
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

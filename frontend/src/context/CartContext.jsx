import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart when user logs in
    useEffect(() => {
        if (user) {
            const storedCart = localStorage.getItem(`cart_${user.id}`);
            if (storedCart) {
                setCart(JSON.parse(storedCart));
            } else {
                setCart([]); // Reset if new user has no data
            }
        } else {
            // Guest mode: Reset on refresh (effectively empty on mount)
            // If we wanted session persistence we'd use sessionStorage here, 
            // but user asked for "refresh -> empty", so we do nothing (default []).
            setCart([]);
        }
    }, [user]);

    // Save cart when it changes (only for logged-in users)
    useEffect(() => {
        if (user) {
            localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
        }
    }, [cart, user]);

    const addToCart = (product, size, quantity = 1) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(
                item => item.id === product.id && item.size === size
            );

            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            } else {
                return [...prevCart, { ...product, size, quantity }];
            }
        });
        setIsCartOpen(true); // Open cart drawer/modal when item added
    };

    const removeFromCart = (id, size) => {
        setCart(prevCart => prevCart.filter(item => !(item.id === id && item.size === size)));
    };

    const updateQuantity = (id, size, quantity) => {
        if (quantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                (item.id === id && item.size === size) ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};

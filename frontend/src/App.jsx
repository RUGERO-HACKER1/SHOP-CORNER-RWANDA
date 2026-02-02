import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import { useToast } from './context/ToastContext';
import { useSocket } from './context/SocketContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import Returns from './pages/Returns';
import { WishlistProvider } from './context/WishlistContext';
import AiAssistant from './components/AiAssistant';
import WhatsAppButton from './components/WhatsAppButton';

const App = () => {
  const socket = useSocket();
  const { showToast } = useToast();

  useEffect(() => {
    if (socket) {
      socket.on('notification', (data) => {
        showToast(data.message, 'success');
        console.log('Notification received:', data);
      });

      return () => {
        socket.off('notification');
      };
    }
  }, [socket, showToast]);

  return (
    <WishlistProvider>
        <div className="min-h-screen bg-white transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order-success" element={<OrderSuccess />} />

            {/* Footer Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/returns" element={<Returns />} />
          </Routes>
          <Footer />
          <WhatsAppButton />
          <AiAssistant />
        </div>
      </WishlistProvider>
  );
};

export default App;

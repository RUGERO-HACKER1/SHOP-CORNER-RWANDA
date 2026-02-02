import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { SocketProvider } from './context/SocketContext';
import App from './App.jsx';
import './index.css';

// Force light mode: ensure root never has the Tailwind `dark` class
if (typeof document !== 'undefined') {
  document.documentElement.classList.remove('dark');
  try {
    localStorage.removeItem('theme');
  } catch {
    // ignore
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <SocketProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </SocketProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

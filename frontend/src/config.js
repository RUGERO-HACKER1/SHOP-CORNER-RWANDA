// Centralized API Configuration
// In production, VITE_API_URL must be set in Vercel Environment Variables
// Locally, it falls back to http://localhost:5000

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : 'https://shop-corner-rwanda.onrender.com');

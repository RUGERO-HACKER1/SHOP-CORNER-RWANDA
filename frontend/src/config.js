// Centralized API Configuration
// In production, VITE_API_URL should be set in environment variables
// Locally, it falls back to http://localhost:5000

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

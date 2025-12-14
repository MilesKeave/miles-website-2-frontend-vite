// API Configuration
// Automatically detects environment:
// - Development: Uses localhost:8080
// - Production: Uses VITE_API_BASE_URL environment variable

const getApiBaseUrl = (): string => {
  // In development mode, always use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:8080/api';
  }
  
  // In production, use environment variable if set
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Fallback (shouldn't happen in production if env var is set)
  console.warn('VITE_API_BASE_URL not set in production. Using localhost fallback.');
  return 'http://localhost:8080/api';
};

export const API_BASE_URL = getApiBaseUrl();


const getApiBaseUrl = (): string => {
  if (import.meta.env.DEV) {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8080/api';
    } else {
      return `http://${hostname}:8080/api`;
    }
  }
  
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  console.warn('VITE_API_BASE_URL not set in production. Using localhost fallback.');
  return 'http://localhost:8080/api';
};

export const API_BASE_URL = getApiBaseUrl();


import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Preserve persistent user session across tabs and network re-connections
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Preserve localStorage session so user stays logged in across tab switching
    return Promise.reject(error);
  }
);

export default api;

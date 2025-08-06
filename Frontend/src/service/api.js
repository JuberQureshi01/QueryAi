// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://queryai-kqcu.onrender.com/api', // Your backend URL
});

// This is an interceptor. It runs before every request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

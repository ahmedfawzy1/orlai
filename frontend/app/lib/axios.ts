import axios from 'axios';
import { getSession } from 'next-auth/react';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';

export const axiosInstance = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add NextAuth JWT to requests
axiosInstance.interceptors.request.use(
  async config => {
    try {
      const session = await getSession();
      if (session?.user?.id) {
        // Get JWT token from our API route
        const response = await fetch('/api/auth/token');
        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            config.headers.Authorization = `Bearer ${data.token}`;
          }
        }
      }
    } catch (error) {
      console.error('Error adding auth to request:', error);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Handle response errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login on unauthorized
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.startsWith('/login')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

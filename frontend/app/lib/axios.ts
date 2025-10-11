import axios from 'axios';
import { getSession } from 'next-auth/react';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';

export const axiosInstance = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
});

// Add NextAuth token to requests
axiosInstance.interceptors.request.use(
  async config => {
    const session = await getSession();
    if (session?.user) {
      try {
        const response = await fetch('/api/auth/token');
        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            config.headers.Authorization = `Bearer ${data.token}`;
          }
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default axiosInstance;

import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5001/api'
      : `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
  withCredentials: true,
});

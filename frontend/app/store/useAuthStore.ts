import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  isRequestingOtp: boolean;
  isVerifyingOtp: boolean;
  isResettingPassword: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  requestOtp: (email: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  resetPassword: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>(set => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isRequestingOtp: false,
  isVerifyingOtp: false,
  isResettingPassword: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get(`/auth/check`);
      set({ authUser: res.data });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 401) {
        console.error('Error checking auth:', error.response?.data?.message);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post('/auth/signup', data);
      set({ authUser: res.data });
      toast.success('Account created successfully');
      return true;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 401) {
        toast.error(error?.response?.data?.message);
        console.error('Error signup:', error?.response?.data?.message);
      }
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: { email: string; password: string }) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser: res.data });
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 401) {
        toast.error(error.response?.data?.message);
        console.error('Error login:', error.response?.data?.message);
      }
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 401) {
        toast.error(error?.response?.data.message);
        console.error('Error logout:', error?.response?.data.message);
      }
    }
  },

  requestOtp: async (email: string) => {
    try {
      set({ isRequestingOtp: true });
      await axiosInstance.post('/auth/request-otp', { email });
      toast.success('OTP sent to your email');
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Failed to send OTP');
        console.error('Error requesting OTP:', error.response?.data?.message);
      }
      return false;
    } finally {
      set({ isRequestingOtp: false });
    }
  },

  verifyOtp: async (email: string, otp: string) => {
    try {
      set({ isVerifyingOtp: true });
      await axiosInstance.post('/auth/verify-otp', { email, otp });
      toast.success('OTP verified successfully');
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Failed to verify OTP');
        console.error('Error verifying OTP:', error.response?.data?.message);
      }
      return false;
    } finally {
      set({ isVerifyingOtp: false });
    }
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    try {
      set({ isResettingPassword: true });
      await axiosInstance.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      toast.success('Password reset successfully');
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || 'Failed to reset password'
        );
        console.error(
          'Error resetting password:',
          error.response?.data?.message
        );
      }
      return false;
    } finally {
      set({ isResettingPassword: false });
    }
  },
}));

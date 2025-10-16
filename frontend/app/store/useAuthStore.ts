import { create } from 'zustand';
import { signIn, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

interface AuthState {
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isRequestingOtp: boolean;
  isVerifyingOtp: boolean;
  isResettingPassword: boolean;

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
    newPassword: string,
  ) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>(set => ({
  isSigningUp: false,
  isLoggingIn: false,
  isRequestingOtp: false,
  isVerifyingOtp: false,
  isResettingPassword: false,

  signup: async data => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post('/auth/signup', data);

      if (res.status === 201) {
        // Auto-login after signup
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error(
            'Account created but login failed. Please login manually.',
          );
          return false;
        }

        toast.success('Account created successfully');
        return true;
      }
      return false;
    } catch (error: any) {
      // Check if it's a Google user error
      if (error?.response?.data?.isGoogleUser) {
        toast.error(error.response.data.message);
      } else {
        const errorMessage = error?.response?.data?.message || 'Signup failed';
        toast.error(errorMessage);
      }
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async data => {
    try {
      set({ isLoggingIn: true });

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password');
        return false;
      }

      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      toast.error('Login failed');
      console.error('Login failed:', error);
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Logged out successfully');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
    }
  },

  requestOtp: async (email: string) => {
    try {
      set({ isRequestingOtp: true });
      await axiosInstance.post('/auth/request-otp', { email });
      toast.success('OTP sent to your email');
      return true;
    } catch (error: any) {
      console.error('Failed to send OTP:', error);
      toast.error(error.response?.data?.message || 'Failed to send OTP');
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
    } catch (error: any) {
      console.error('Failed to verify OTP:', error);
      toast.error(error.response?.data?.message || 'Failed to verify OTP');
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
    } catch (error: any) {
      console.error('Failed to reset password:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
      return false;
    } finally {
      set({ isResettingPassword: false });
    }
  },
}));

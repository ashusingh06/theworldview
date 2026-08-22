import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, RegisterFormData } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithProfile: (data: RegisterFormData) => Promise<void>;
  loginWithGoogle: () => Promise<{ requiresRegistration: boolean }>;
  sendEmailOtp: (email: string, recipientName?: string) => Promise<{ otp: string; expiresAt: number }>;
  verifyEmailOtp: (email: string, otp: string) => Promise<boolean>;
  getPendingGoogleUser: () => Partial<RegisterFormData> | null;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentLocalUser());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthState((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const user = await authService.loginWithEmail(email, password);
      setCurrentUser(user);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerWithProfile = async (data: RegisterFormData) => {
    setError(null);
    setLoading(true);
    try {
      const user = await authService.registerWithProfile(data);
      setCurrentUser(user);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<{ requiresRegistration: boolean }> => {
    setError(null);
    setLoading(true);
    try {
      const result = await authService.loginWithGoogle();
      setCurrentUser(result.user);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendEmailOtp = async (email: string, recipientName?: string) => {
    try {
      return await authService.generateEmailOtp(email, recipientName);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification OTP');
      throw err;
    }
  };

  const verifyEmailOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      const valid = authService.verifyEmailOtp(email, otp);
      if (!valid) {
        throw new Error('Invalid verification code. Please check and try again.');
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
      throw err;
    }
  };

  const getPendingGoogleUser = () => {
    return authService.getPendingGoogleUser();
  };

  const logout = async () => {
    setError(null);
    try {
      await authService.logout();
      setCurrentUser(null);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        loginWithEmail,
        registerWithProfile,
        loginWithGoogle,
        sendEmailOtp,
        verifyEmailOtp,
        getPendingGoogleUser,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

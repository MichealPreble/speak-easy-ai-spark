
import React, { useState, ReactNode } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { User, UpdateProfileData } from '../types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);

  const signIn = async (email: string, password: string, rememberMe = false) => {
    setLoading(true);
    try {
      // TODO: Implement actual authentication logic
      console.log('Signing in', { email, rememberMe });
      // Simulating a successful sign-in
      setUser({ 
        id: 'temp-id', 
        email,
        user_metadata: {
          name: email.split('@')[0],
          full_name: email.split('@')[0],
        } 
      });
      setIsEmailVerified(true);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      // TODO: Implement actual sign-up logic
      console.log('Signing up', { email, name });
      // Simulating a successful sign-up
      setUser({ 
        id: 'temp-id', 
        email, 
        name,
        user_metadata: {
          name,
          full_name: name,
        } 
      });
      setIsEmailVerified(false);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual logout logic
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Alias logout to signOut for backward compatibility
  const logout = signOut;

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      // TODO: Implement actual password reset logic
      console.log('Resetting password for', email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setLoading(true);
    try {
      // TODO: Implement actual password update logic
      console.log('Updating password');
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    setLoading(true);
    try {
      if (user) {
        setUser({
          ...user,
          ...(data.email && { email: data.email }),
          ...(data.name && { name: data.name }),
          user_metadata: {
            ...user.user_metadata,
            ...(data.name && { name: data.name, full_name: data.name }),
            ...(data.avatar_url && { avatar_url: data.avatar_url }),
            ...(data.is_admin !== undefined && { is_admin: data.is_admin }),
          }
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual email verification logic
      console.log('Sending verification email to', user?.email);
    } catch (error) {
      console.error('Send verification email error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isEmailVerified, 
        signIn, 
        signUp, 
        signOut, 
        logout, 
        resetPassword, 
        updatePassword, 
        updateProfile, 
        sendVerificationEmail 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

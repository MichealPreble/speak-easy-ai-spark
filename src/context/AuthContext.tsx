
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the user object
interface User {
  id: string;
  email: string;
  name?: string;
  user_metadata?: {
    name?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

// Update the AuthContextType to include all required methods
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isEmailVerified: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias for signOut for backward compatibility
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}

// Create the context with a default value that matches the interface
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  isEmailVerified: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {},
  updateProfile: async () => {},
  sendVerificationEmail: async () => {},
});

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);

  // Placeholder implementation for signIn
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

  // Placeholder implementation for signUp
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

  // Placeholder implementation for signOut/logout
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

  // Placeholder implementation for resetPassword
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

  // Placeholder implementation for updatePassword
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

  // Placeholder implementation for updateProfile
  const updateProfile = async (data: { name?: string; email?: string }) => {
    setLoading(true);
    try {
      // TODO: Implement actual profile update logic
      console.log('Updating profile', data);
      if (user) {
        setUser({
          ...user,
          ...(data.email && { email: data.email }),
          ...(data.name && { name: data.name }),
          user_metadata: {
            ...user.user_metadata,
            ...(data.name && { name: data.name, full_name: data.name }),
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

  // Placeholder implementation for sendVerificationEmail
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

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


import { createContext } from 'react';
import type { AuthContextType } from '../types/auth';

// Create the context with a default value that matches the interface
export const AuthContext = createContext<AuthContextType>({
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

// Re-export the Provider and hook for convenience
export { AuthProvider } from '../providers/AuthProvider';
export { useAuth } from '../hooks/useAuth';

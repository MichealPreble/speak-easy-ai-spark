
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the user object
interface User {
  id: string;
  email: string;
  name?: string;
}

// Update the AuthContextType to include signIn and signUp methods
interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with a default value that matches the interface
const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
});

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Placeholder implementation for signIn
  const signIn = async (email: string, password: string, rememberMe = false) => {
    // TODO: Implement actual authentication logic
    console.log('Signing in', { email, rememberMe });
    // Simulating a successful sign-in
    setUser({ id: 'temp-id', email });
  };

  // Placeholder implementation for signUp
  const signUp = async (email: string, password: string, name?: string) => {
    // TODO: Implement actual sign-up logic
    console.log('Signing up', { email, name });
    // Simulating a successful sign-up
    setUser({ id: 'temp-id', email, name });
  };

  // Placeholder implementation for logout
  const logout = async () => {
    // TODO: Implement actual logout logic
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout }}>
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

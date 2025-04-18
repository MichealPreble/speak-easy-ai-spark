
// Define the shape of the user object
export interface User {
  id: string;
  email: string;
  name?: string;
  user_metadata?: {
    name?: string;
    full_name?: string;
    avatar_url?: string;
    is_admin?: boolean;
  };
}

// Update the interface to use consistent naming
export interface UpdateProfileData {
  name?: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  is_admin?: boolean;
}

// Update the AuthContextType to include all required methods
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isEmailVerified: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}

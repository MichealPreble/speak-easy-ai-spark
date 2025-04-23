import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { User, UpdateProfileData } from '../types/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const { toast } = useToast();

  // Initialize session on load
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Check if Supabase is configured
        if (!supabase) {
          console.error('Supabase not configured');
          setLoading(false);
          return;
        }
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          
          if (currentUser) {
            setUser({
              id: currentUser.id,
              email: currentUser.email || '',
              name: currentUser.user_metadata?.name,
              user_metadata: {
                name: currentUser.user_metadata?.name,
                full_name: currentUser.user_metadata?.full_name,
                avatar_url: currentUser.user_metadata?.avatar_url,
                is_admin: currentUser.user_metadata?.is_admin,
              }
            });
            
            // Check email verification status
            setIsEmailVerified(currentUser.email_confirmed_at !== null);
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    // Set up auth state change listener
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session) {
            // User signed in or updated
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            
            if (currentUser) {
              setUser({
                id: currentUser.id,
                email: currentUser.email || '',
                name: currentUser.user_metadata?.name,
                user_metadata: {
                  name: currentUser.user_metadata?.name,
                  full_name: currentUser.user_metadata?.full_name,
                  avatar_url: currentUser.user_metadata?.avatar_url,
                  is_admin: currentUser.user_metadata?.is_admin,
                }
              });
              
              // Check email verification status
              setIsEmailVerified(currentUser.email_confirmed_at !== null);
            }
          } else {
            // User signed out
            setUser(null);
            setIsEmailVerified(false);
          }
        }
      );

      // Clean up subscription
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const signIn = async (email: string, password: string, rememberMe = false) => {
    setLoading(true);
    try {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name,
          user_metadata: {
            name: data.user.user_metadata?.name,
            full_name: data.user.user_metadata?.full_name,
            avatar_url: data.user.user_metadata?.avatar_url,
            is_admin: data.user.user_metadata?.is_admin,
          }
        });
        
        // Check email verification status
        setIsEmailVerified(data.user.email_confirmed_at !== null);
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            full_name: name,
          },
          // By default, redirect to the current origin
          emailRedirectTo: `${window.location.origin}/auth/verify`
        }
      });

      if (error) throw error;
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name,
          user_metadata: {
            name,
            full_name: name,
          }
        });
        
        // New account needs email verification
        setIsEmailVerified(false);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user state
      setUser(null);
      setIsEmailVerified(false);
    } catch (error: any) {
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
      if (!supabase) throw new Error('Supabase not configured');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setLoading(true);
    try {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Update password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    setLoading(true);
    try {
      if (!supabase) throw new Error('Supabase not configured');
      if (!user) throw new Error('No user logged in');
      
      // Prepare user metadata updates
      const metadata: Record<string, any> = {};
      
      if (data.name) {
        metadata.name = data.name;
        metadata.full_name = data.name;
      }
      
      if (data.avatar_url) {
        metadata.avatar_url = data.avatar_url;
      }
      
      if (data.is_admin !== undefined) {
        metadata.is_admin = data.is_admin;
      }
      
      // Prepare update payload
      const updatePayload: any = {
        data: metadata
      };
      
      // Add email to update if provided
      if (data.email && data.email !== user.email) {
        updatePayload.email = data.email;
      }
      
      // Update user
      const { data: userData, error } = await supabase.auth.updateUser(updatePayload);
      
      if (error) throw error;
      
      if (userData.user) {
        // Update local user state
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
        
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    setLoading(true);
    try {
      if (!supabase) throw new Error('Supabase not configured');
      if (!user?.email) throw new Error('User email not available');
      
      // Resend email verification
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      });
    } catch (error: any) {
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

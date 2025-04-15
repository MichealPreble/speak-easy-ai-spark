
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  isEmailVerified: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      
      // Check email verification status
      if (data.session?.user) {
        setIsEmailVerified(!!data.session.user.email_confirmed_at);
      }
      
      setLoading(false);
    };
    
    getInitialSession();

    // Set up auth subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Update email verification status when auth state changes
        if (currentSession?.user) {
          setIsEmailVerified(!!currentSession.user.email_confirmed_at);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    });
    
    if (error) throw error;
    
    if (data.user && !data.user.email_confirmed_at) {
      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account.",
      });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };
  
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    
    if (error) throw error;
    
    toast({
      title: "Password reset email sent",
      description: "Check your email for a link to reset your password.",
    });
  };
  
  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) throw error;
    
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    });
  };
  
  const sendVerificationEmail = async () => {
    if (!user?.email) {
      throw new Error("No user email found");
    }
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    });
    
    if (error) throw error;
    
    toast({
      title: "Verification email sent",
      description: "Please check your email to verify your account.",
    });
  };
  
  const updateProfile = async (data: { full_name?: string; avatar_url?: string }) => {
    if (!user) throw new Error("No user logged in");
    
    const updates = {
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    // First update auth metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: updates
    });
    
    if (updateError) throw updateError;
    
    // Then update the profile in the profiles table if you have one
    // This assumes you have a profiles table with RLS policies set up
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...updates
      });
      
    if (profileError) throw profileError;
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        sendVerificationEmail,
        isEmailVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

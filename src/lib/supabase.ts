
import { createClient } from '@supabase/supabase-js';

// Get environment variables with proper fallbacks
// Using dummy values for development to avoid runtime errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Initialize the Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  const isRealUrl = supabaseUrl !== 'https://placeholder.supabase.co';
  const isRealKey = supabaseKey !== 'placeholder-key';
  const isConfigured = isRealUrl && isRealKey;
  
  // Only show warning in development environment
  if (!isConfigured && import.meta.env.DEV) {
    console.warn(
      'Supabase not properly configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
    );
  }
  
  return isConfigured;
};

// Call isSupabaseConfigured once to check configuration on initialization
isSupabaseConfigured();

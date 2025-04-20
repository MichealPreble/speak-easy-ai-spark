
import { createClient } from '@supabase/supabase-js';

declare const import_meta_env: {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  DEV: boolean;
};

// Get environment variables with fallbacks to prevent runtime errors
const supabaseUrl = import_meta_env.VITE_SUPABASE_URL || '';
const supabaseKey = import_meta_env.VITE_SUPABASE_ANON_KEY || '';

// Initialize the Supabase client with empty string fallbacks
// This prevents runtime errors but still allows the app to load
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
  const isConfigured = Boolean(supabaseUrl) && Boolean(supabaseKey);
  
  // Only show warning in development environment
  if (!isConfigured && import_meta_env.DEV) {
    console.warn(
      'Supabase not properly configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
    );
  }
  
  return isConfigured;
};

// Call isSupabaseConfigured once to check configuration on initialization
isSupabaseConfigured();


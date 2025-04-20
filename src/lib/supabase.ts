
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase not properly configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  const isConfigured = supabaseUrl !== '' && supabaseKey !== '';
  
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

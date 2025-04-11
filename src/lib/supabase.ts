
import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Validate configuration
if (supabaseUrl === 'https://example.supabase.co' || supabaseKey === 'your-anon-key') {
  console.warn(
    'Supabase not properly configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return supabaseUrl !== 'https://example.supabase.co' && supabaseKey !== 'your-anon-key';
};

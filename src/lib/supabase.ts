
import { createClient } from '@supabase/supabase-js';

// Create supabase client with environment variables
// Using proper type-safe approach with import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Return true only if both env vars exist
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseKey;
};

// Create supabase client or null if config missing
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Test connection to Supabase (used in health checks)
export const testSupabaseConnection = async () => {
  try {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('newsletter_issues')
      .select('id')
      .limit(1);

    return {
      success: !error,
      message: error ? error.message : 'Connection successful'
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Connection test failed'
    };
  }
};

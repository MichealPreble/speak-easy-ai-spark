
import { createClient } from '@supabase/supabase-js';

// Improved environment variable access with console logging
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log configuration status to console (for debugging)
console.log(`Supabase configuration status:
URL defined: ${!!supabaseUrl}
Key defined: ${!!supabaseKey}`);

// Return true only if both env vars exist and are non-empty
export const isSupabaseConfigured = () => {
  const isConfigured = !!supabaseUrl && !!supabaseKey;
  return isConfigured;
};

// Create supabase client or null if config missing
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Test connection to Supabase (used in health checks)
export const testSupabaseConnection = async () => {
  try {
    if (!isSupabaseConfigured()) {
      console.error('Supabase configuration missing:', {
        url: !!supabaseUrl ? 'defined' : 'missing',
        key: !!supabaseKey ? 'defined' : 'missing'
      });
      return {
        success: false,
        message: 'Supabase not configured - missing environment variables'
      };
    }
    
    if (!supabase) {
      return {
        success: false,
        message: 'Supabase client creation failed'
      };
    }
    
    // Test a simple database query
    const { data, error } = await supabase
      .from('newsletter_issues')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
    }

    return {
      success: !error,
      message: error ? `Connection error: ${error.message}` : 'Connection successful'
    };
  } catch (err) {
    console.error('Supabase connection exception:', err);
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Connection test failed with unknown error'
    };
  }
};

// New helper function to get more diagnostic information
export const getSupabaseConfigStatus = () => {
  return {
    isConfigured: isSupabaseConfigured(),
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    clientInitialized: !!supabase
  };
};

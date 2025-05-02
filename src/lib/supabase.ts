
import { createClient } from '@supabase/supabase-js';

/**
 * Runtime validation for required environment variables.
 */
function getEnvVar(name: string): string {
  // Access environment variables safely using the properly typed import.meta.env
  const value = import.meta.env[name];
  if (!value) {
    console.warn(`❌ Missing environment variable: ${name}`);
    return '';
  }
  return value;
}

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Log configuration status to console (for debugging)
console.log(`Supabase configuration status:
URL defined: ${!!supabaseUrl}
Key defined: ${!!supabaseAnonKey}`);

// Return true only if both env vars exist and are non-empty
export const isSupabaseConfigured = () => {
  const isConfigured = !!supabaseUrl && !!supabaseAnonKey;
  return isConfigured;
};

// Create supabase client or null if config missing
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Test connection to Supabase (used in health checks)
export const testSupabaseConnection = async () => {
  try {
    if (!isSupabaseConfigured()) {
      console.error('Supabase configuration missing:', {
        url: !!supabaseUrl ? 'defined' : 'missing',
        key: !!supabaseAnonKey ? 'defined' : 'missing'
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
    hasKey: !!supabaseAnonKey,
    clientInitialized: !!supabase
  };
};


import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Get environment variables with proper fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Flag to track if we've already shown the configuration warning
let hasShownConfigWarning = false;

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  const isRealUrl = supabaseUrl !== 'https://placeholder.supabase.co';
  const isRealKey = supabaseKey !== 'placeholder-key';
  const isConfigured = isRealUrl && isRealKey;
  
  // Only show warning once and only in development environment
  if (!isConfigured && !hasShownConfigWarning) {
    hasShownConfigWarning = true;
    
    if (import.meta.env.DEV) {
      console.warn(
        'Supabase not properly configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
      );
    } else {
      // In production, use toast for user-friendly notification and log for monitoring systems
      console.error('Supabase configuration error: Missing environment variables in production environment');
      toast.error('Database connection error. Please contact support.', {
        duration: 5000,
        id: 'supabase-config-error', // Prevent duplicate toasts
      });
    }
  }
  
  return isConfigured;
};

// Initialize the Supabase client with error handling
let supabaseInstance: ReturnType<typeof createClient>;

try {
  supabaseInstance = createClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    }
  );
  
  // Check configuration on initialization
  isSupabaseConfigured();
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  
  // Fallback client that will fail gracefully instead of crashing the app
  supabaseInstance = createClient(
    'https://placeholder.supabase.co',
    'placeholder-key',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    }
  );
  
  if (!import.meta.env.DEV) {
    toast.error('Database connection failed. Some features may not work properly.', {
      duration: 5000,
      id: 'supabase-init-error',
    });
  }
}

// Export the Supabase client
export const supabase = supabaseInstance;

// Export a function to test the connection (useful for health checks)
export async function testSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    return { success: false, message: 'Supabase not configured' };
  }
  
  try {
    const { error } = await supabase.from('messages').select('id').limit(1);
    return { 
      success: !error, 
      message: error ? `Connection error: ${error.message}` : 'Connected successfully' 
    };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown connection error' 
    };
  }
}

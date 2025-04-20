
import { createClient } from '@supabase/supabase-js';
import type { ImportMetaEnv } from '@/types/practiceTypes';

// Explicitly type the environment variables
const supabaseUrl = (import.meta.env as ImportMetaEnv).VITE_SUPABASE_URL || '';
const supabaseKey = (import.meta.env as ImportMetaEnv).VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => !!supabaseUrl && !!supabaseKey;

export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

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

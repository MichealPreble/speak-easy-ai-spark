import { createClient } from '@supabase/supabase-js';
import { ImportMetaEnv } from '@/types/practiceTypes';

// Use type assertion to handle import.meta.env
const supabaseUrl = (import.meta as ImportMeta).env.VITE_SUPABASE_URL || '';
const supabaseKey = (import.meta as ImportMeta).env.VITE_SUPABASE_ANON_KEY || '';

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

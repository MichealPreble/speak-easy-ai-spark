
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function usePracticeData() {
  const { user } = useAuth();
  const [occasions, setOccasions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    const fetchPracticeData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch unique occasions practiced by the user
        const { data, error: occasionsError } = await supabase
          .from('practice_sessions')
          .select('occasion_name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (occasionsError) throw new Error(occasionsError.message);
        
        // Extract unique occasion names and ensure they are strings
        if (data) {
          const uniqueOccasions = [...new Set(
            data
              .map((item: any) => (item.occasion_name ? String(item.occasion_name) : null))
              .filter(Boolean) as string[]
          )];
          setOccasions(uniqueOccasions);
        }
      } catch (err) {
        console.error('Error fetching practice data:', err);
        setError(err instanceof Error ? err.message : 'Error fetching practice data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPracticeData();
  }, [user]);
  
  return {
    occasions,
    isLoading,
    error
  };
}

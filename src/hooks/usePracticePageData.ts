
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function usePracticePageData() {
  const { user } = useAuth();
  const [favoriteOccasions, setFavoriteOccasions] = useState<string[]>([]);
  const [recentOccasions, setRecentOccasions] = useState<string[]>([]);
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
        // Fetch favorite occasions
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('user_favorites')
          .select('occasion_name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (favoritesError) throw new Error(favoritesError.message);
        
        if (favoritesData) {
          // Ensure all items are strings
          const typedFavorites: string[] = favoritesData
            .map((item: any) => (item.occasion_name ? String(item.occasion_name) : null))
            .filter(Boolean) as string[];
            
          setFavoriteOccasions(typedFavorites);
        }
        
        // Fetch recent occasions
        const { data: recentData, error: recentError } = await supabase
          .from('practice_sessions')
          .select('occasion_name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentError) throw new Error(recentError.message);
        
        if (recentData) {
          // Get unique occasion names and ensure they are strings
          const uniqueRecent = [...new Set(
            recentData
              .map((item: any) => (item.occasion_name ? String(item.occasion_name) : null))
              .filter(Boolean) as string[]
          )];
          
          setRecentOccasions(uniqueRecent);
        }
      } catch (err) {
        console.error('Error fetching practice page data:', err);
        setError(err instanceof Error ? err.message : 'Error fetching practice data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPracticeData();
  }, [user]);
  
  return {
    favoriteOccasions,
    recentOccasions,
    isLoading,
    error
  };
}

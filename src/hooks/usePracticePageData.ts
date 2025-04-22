
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { PracticePageData, Milestone, BlogPostPreview } from '@/types/practiceTypes';
import { SpeechOccasion } from '@/types/speechOccasions';
import { supabase } from '@/lib/supabase';
import { SPEECH_OCCASIONS } from '@/data/speechOccasions';

export function usePracticePageData(): PracticePageData {
  const { user } = useAuth();
  const [favoriteOccasions, setFavoriteOccasions] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<SpeechOccasion | null>(null);
  const [blogPreviews, setBlogPreviews] = useState<BlogPostPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Statistics state
  const [totalSessions, setTotalSessions] = useState(0);
  const [uniqueOccasions, setUniqueOccasions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [notesAdded, setNotesAdded] = useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const handleSelect = (occasion: SpeechOccasion) => {
    setSelectedOccasion(occasion);
  };

  const handleSelectSession = (sessionId: string) => {
    // Session selection logic
  };

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
        
        // Initialize some placeholder milestones
        const defaultMilestones: Milestone[] = [
          {
            id: '1',
            label: 'First Practice',
            title: 'First Practice Session',
            description: 'Complete your first practice session',
            completed: false,
            achieved: false,
            progress: 0,
            target: 1,
            tip: 'Start with a short practice session to build confidence'
          },
          {
            id: '2',
            label: 'Multiple Occasions',
            title: 'Try Different Occasions',
            description: 'Practice with 3 different speech occasions',
            completed: false,
            achieved: false,
            progress: 0,
            target: 3,
            tip: 'Different occasions require different communication styles'
          }
        ];
        setMilestones(defaultMilestones);
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
    selectedOccasion,
    favorites: favoriteOccasions,
    setFavorites: setFavoriteOccasions,
    blogPreviews,
    setBlogPreviews,
    totalSessions,
    uniqueOccasions,
    totalMinutes,
    notesAdded,
    milestones,
    recentOccasions: [],
    practiceSessions: [],
    userId: user?.id || null,
    shareUrl: `/share/${user?.id || 'preview'}`,
    handleSelect,
    handleSelectSession,
  };
}

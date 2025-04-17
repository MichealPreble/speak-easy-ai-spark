
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SPEECH_OCCASIONS } from '@/data/speechOccasions';
import { SpeechOccasion } from '@/types/speechOccasions';
import { useToast } from '@/hooks/use-toast';

export interface ProgressStats {
  totalSessions: number;
  uniqueOccasions: number;
  totalHours: number;
  notesAdded: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  progress: number;
  target: number;
  tip: string;
}

export interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
}

export const usePracticeData = () => {
  const [selectedOccasion, setSelectedOccasion] = useState<SpeechOccasion | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    totalSessions: 0,
    uniqueOccasions: 0,
    totalHours: 0,
    notesAdded: 0,
  });
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [blogPreviews, setBlogPreviews] = useState<BlogPostPreview[]>([]);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);
      
      // Fetch favorites
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('occasion_name')
        .eq('user_id', user.id);

      if (favoritesError) {
        console.error('Error fetching favorites:', favoritesError);
        return;
      }

      if (favoritesData) {
        setFavorites(favoritesData.map((item) => item.occasion_name));
        trackEvent('view_favorites', 'SpeechPractice', 'Favorites Loaded');
      }

      // Fetch progress stats
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('practice_sessions')
        .select('occasion_name, notes')
        .eq('user_id', user.id);

      if (sessionsError) {
        console.error('Error fetching practice sessions:', sessionsError);
        return;
      }

      if (sessionsData) {
        const totalSessions = sessionsData.length;
        const uniqueOccasions = new Set(sessionsData.map((s) => s.occasion_name)).size;
        const notesAdded = sessionsData.filter((s) => s.notes).length;
        const totalHours = totalSessions * 0.5;

        const stats = {
          totalSessions,
          uniqueOccasions,
          totalHours,
          notesAdded,
        };
        
        setProgressStats(stats);
        setMilestones(calculateMilestones(stats));
        trackEvent('view_progress_stats', 'SpeechPractice', 'Progress Stats Loaded');
      }
    };

    fetchData();
  }, [trackEvent]);

  // Restore selected occasion from session storage
  useEffect(() => {
    const storedOccasion = sessionStorage.getItem('selectedOccasion');
    if (storedOccasion) {
      const occasion = SPEECH_OCCASIONS.flatMap((cat) => cat.occasions).find(
        (occ) => occ.name === storedOccasion
      );
      if (occasion) {
        setSelectedOccasion(occasion);
        trackEvent('restore_occasion', 'SpeechPractice', occasion.name);
      }
    }
  }, [trackEvent]);

  return {
    selectedOccasion,
    setSelectedOccasion,
    favorites,
    setFavorites,
    progressStats,
    milestones,
    userId,
    blogPreviews,
    setBlogPreviews
  };
};

function calculateMilestones(stats: ProgressStats): Milestone[] {
  return [
    {
      id: 'sessions_10',
      title: '10 Sessions',
      description: 'Completed 10 practice sessions',
      achieved: stats.totalSessions >= 10,
      progress: stats.totalSessions,
      target: 10,
      tip: 'Keep practicing regularly to improve your skills!',
    },
    {
      id: 'occasions_5',
      title: '5 Occasions',
      description: 'Practiced 5 unique occasions',
      achieved: stats.uniqueOccasions >= 5,
      progress: stats.uniqueOccasions,
      target: 5,
      tip: 'Try practicing different occasions to broaden your experience.',
    },
    {
      id: 'hours_5',
      title: '5 Hours',
      description: 'Practiced for 5 total hours',
      achieved: stats.totalHours >= 5,
      progress: stats.totalHours,
      target: 5,
      tip: 'Dedicate more time to refine your delivery and confidence.',
    },
    {
      id: 'notes_5',
      title: '5 Notes',
      description: 'Added notes to 5 practice sessions',
      achieved: stats.notesAdded >= 5,
      progress: stats.notesAdded,
      target: 5,
      tip: 'Use notes to track your progress and key takeaways.',
    },
  ];
}

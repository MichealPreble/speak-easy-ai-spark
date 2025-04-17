import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SpeechOccasion } from '@/types/speechOccasions';
import { Milestone, BlogPostPreview, PracticeSession } from '@/types/practiceTypes';
import { SPEECH_OCCASIONS } from '@/data/speech-occasions';

export const usePracticePageData = () => {
  const [selectedOccasion, setSelectedOccasion] = useState<SpeechOccasion | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [blogPreviews, setBlogPreviews] = useState<BlogPostPreview[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [uniqueOccasions, setUniqueOccasions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [notesAdded, setNotesAdded] = useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const { trackEvent } = useAnalytics();
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/practice`;

  const handleSelect = (occasion: SpeechOccasion) => {
    setSelectedOccasion(occasion);
    sessionStorage.setItem('selectedOccasion', occasion.name);
    trackEvent('select_occasion', 'SpeechPractice', occasion.name);
  };

  const handleSelectSession = (occasion: SpeechOccasion, session: PracticeSession) => {
    setSelectedOccasion(occasion);
    sessionStorage.setItem('selectedOccasion', occasion.name);
    trackEvent('select_practice_session', 'SpeechPractice', occasion.name);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
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
          const totalMinutes = totalSessions * 30;

          setTotalSessions(totalSessions);
          setUniqueOccasions(uniqueOccasions);
          setTotalMinutes(totalMinutes);
          setNotesAdded(notesAdded);

          const milestones: Milestone[] = [
            {
              id: 'sessions_10',
              title: '10 Sessions',
              description: 'Completed 10 practice sessions',
              achieved: totalSessions >= 10,
              progress: totalSessions,
              target: 10,
              tip: 'Keep practicing regularly to improve your skills!',
            },
            {
              id: 'occasions_5',
              title: '5 Occasions',
              description: 'Practiced 5 unique occasions',
              achieved: uniqueOccasions >= 5,
              progress: uniqueOccasions,
              target: 5,
              tip: 'Try practicing different occasions to broaden your experience.',
            },
            {
              id: 'hours_5',
              title: '5 Hours',
              description: 'Practiced for 5 total hours',
              achieved: totalMinutes >= 5 * 60,
              progress: totalMinutes / 60,
              target: 5,
              tip: 'Dedicate more time to refine your delivery and confidence.',
            },
            {
              id: 'notes_5',
              title: '5 Notes',
              description: 'Added notes to 5 practice sessions',
              achieved: notesAdded >= 5,
              progress: notesAdded,
              target: 5,
              tip: 'Use notes to track your progress and key takeaways.',
            },
          ];
          setMilestones(milestones);
          trackEvent('view_progress_stats', 'SpeechPractice', 'Progress Stats Loaded');
        }
      }
    };
    fetchData();
  }, [trackEvent]);

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
    favorites,
    setFavorites,
    blogPreviews,
    setBlogPreviews,
    totalSessions,
    uniqueOccasions,
    totalMinutes,
    notesAdded,
    milestones,
    userId,
    shareUrl,
    handleSelect,
    handleSelectSession
  };
};

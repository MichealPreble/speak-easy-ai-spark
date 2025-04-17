import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';
import { SPEECH_OCCASIONS } from '@/data/speechOccasions';
import SpeechOccasionSelector from '@/components/speech/SpeechOccasionSelector';
import FavoriteOccasions from '@/components/speech/FavoriteOccasions';
import RecentOccasions from '@/components/speech/RecentOccasions';
import PracticeHistory from '@/components/speech/PracticeHistory';
import OccasionDetails from '@/components/speech/OccasionDetails';
import ProgressTracker from '@/components/progress/ProgressTracker';
import PracticeGoals from '@/components/speech/PracticeGoals';
import { SpeechOccasion } from '@/types/speechOccasions';
import { useAnalytics } from '@/hooks/useAnalytics';

interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
}

interface PracticeSession {
  id: string;
  occasion_name: string;
  session_date: string;
  notes?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  progress: number;
  target: number;
  tip: string;
}

const PracticePage: React.FC = () => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Practice Your Speech | SpeakEasyAI</title>
        <meta name="description" content="Practice your speech for any occasion with AI-powered feedback." />
        <meta property="og:title" content="Practice Your Speech | SpeakEasyAI" />
        <meta property="og:description" content="Practice your speech for any occasion with AI-powered feedback." />
        <meta property="og:url" content="https://speakeasyai.com/practice" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-4">Practice Your Speech</h1>
      <ProgressTracker
        totalSessions={totalSessions}
        uniqueOccasions={uniqueOccasions}
        totalDuration={totalMinutes}
        notesAdded={notesAdded}
        milestones={milestones}
        shareUrl={shareUrl}
      />
      <PracticeGoals
        userId={userId}
        stats={{
          totalSessions,
          uniqueOccasions,
          totalHours: totalMinutes / 60,
          notesAdded
        }}
        shareUrl={shareUrl}
      />
      <SpeechOccasionSelector onSelectOccasion={handleSelect} />
      <FavoriteOccasions
        favorites={favorites}
        onSelectFavorite={handleSelect}
      />
      <RecentOccasions onSelectRecent={handleSelect} />
      <PracticeHistory onSelectSession={handleSelectSession} />
      {selectedOccasion && (
        <div className="mt-6">
          <OccasionDetails
            occasion={selectedOccasion}
            favorites={favorites}
            setFavorites={setFavorites}
            blogPreviews={blogPreviews}
            setBlogPreviews={setBlogPreviews}
          />
        </div>
      )}
    </div>
  );
};

export default PracticePage;

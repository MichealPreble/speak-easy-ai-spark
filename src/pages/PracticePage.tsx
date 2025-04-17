import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';
import { useAnalytics } from '@/hooks/useAnalytics';
import SpeechOccasionSelector from '@/components/speech/SpeechOccasionSelector';
import FavoriteOccasions from '@/components/speech/FavoriteOccasions';
import RecentOccasions from '@/components/speech/RecentOccasions';
import PracticeHistory from '@/components/speech/PracticeHistory';
import OccasionDetails from '@/components/speech/OccasionDetails';
import ProgressTracker from '@/components/progress/ProgressTracker';
import { SpeechOccasion } from '@/types/speechOccasions';

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

interface ProgressStats {
  totalSessions: number;
  totalOccasions: number;
  totalDuration: number;
  totalNotes: number;
}

const PracticePage: React.FC = () => {
  const [selectedOccasion, setSelectedOccasion] = useState<SpeechOccasion | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [blogPreviews, setBlogPreviews] = useState<BlogPostPreview[]>([]);
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    totalSessions: 0,
    totalOccasions: 0,
    totalDuration: 0,
    totalNotes: 0
  });
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const fetchProgressStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: sessions } = await supabase
          .from('practice_sessions')
          .select('occasion_name, duration, notes')
          .eq('user_id', user.id);

        if (sessions) {
          const uniqueOccasions = new Set(sessions.map(s => s.occasion_name));
          setProgressStats({
            totalSessions: sessions.length,
            totalOccasions: uniqueOccasions.size,
            totalDuration: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
            totalNotes: sessions.filter(s => s.notes).length
          });
          trackEvent('view_progress_stats', 'Practice', 'Progress Stats Loaded');
        }
      }
    };
    fetchProgressStats();
  }, [trackEvent]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('favorites')
          .select('occasion_name')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching favorites:', error);
          return;
        }

        if (data) {
          setFavorites(data.map(item => item.occasion_name));
          trackEvent('view_favorites', 'Practice', 'Favorites Loaded');
        }
      }
    };

    fetchFavorites();
  }, [trackEvent]);

  useEffect(() => {
    const savedOccasion = sessionStorage.getItem('selectedOccasion');
    if (savedOccasion) {
      setSelectedOccasion(JSON.parse(savedOccasion));
    }
  }, []);

  const handleSelect = (occasion: SpeechOccasion) => {
    setSelectedOccasion(occasion);
    sessionStorage.setItem('selectedOccasion', JSON.stringify(occasion));
    trackEvent('select_occasion', 'Practice', occasion.name);
  };

  const handleSelectSession = (occasion: SpeechOccasion, session: PracticeSession) => {
    setSelectedOccasion(occasion);
    sessionStorage.setItem('selectedOccasion', JSON.stringify(occasion));
    trackEvent('select_practice_session', 'Practice', `${occasion.name} - ${session.session_date}`);
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
      <ProgressTracker {...progressStats} />
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


import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';
import SpeechOccasionSelector from '@/components/speech/SpeechOccasionSelector';
import FavoriteOccasions from '@/components/speech/FavoriteOccasions';
import RecentOccasions from '@/components/speech/RecentOccasions';
import PracticeHistory from '@/components/speech/PracticeHistory';
import OccasionDetails from '@/components/speech/OccasionDetails';
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

const PracticePage: React.FC = () => {
  const [selectedOccasion, setSelectedOccasion] = useState<SpeechOccasion | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [blogPreviews, setBlogPreviews] = useState<BlogPostPreview[]>([]);
  const { trackEvent } = useAnalytics();

  // Fetch favorites on component mount
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
          trackEvent('load_favorites', 'Practice', 'Favorites Loaded');
        }
      }
    };

    fetchFavorites();
  }, [trackEvent]);

  // Restore selected occasion from session storage
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

    // Fetch blog previews for selected occasion
    const fetchBlogPreviews = async () => {
      if (occasion.blogTag) {
        const { data } = await supabase
          .from('blog_posts')
          .select('id, title, excerpt')
          .eq('tag', occasion.blogTag)
          .limit(2);
        
        setBlogPreviews(data || []);
      } else {
        setBlogPreviews([]);
      }
    };

    fetchBlogPreviews();
  };

  const handleSelectSession = (occasion: SpeechOccasion, session: PracticeSession) => {
    setSelectedOccasion(occasion);
    sessionStorage.setItem('selectedOccasion', JSON.stringify(occasion));
    trackEvent('select_practice_session', 'Practice', `${session.occasion_name} - ${session.session_date}`);
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

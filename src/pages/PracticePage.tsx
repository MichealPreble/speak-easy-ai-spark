
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SpeechOccasion } from '@/types/speechOccasions';
import SpeechOccasionSelector from '@/components/speech/SpeechOccasionSelector';
import FavoriteOccasions from '@/components/speech/FavoriteOccasions';
import RecentOccasions from '@/components/speech/RecentOccasions';
import OccasionDetails from '@/components/speech/OccasionDetails';

interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
}

const PracticePage = () => {
  const [selectedOccasion, setSelectedOccasion] = useState<SpeechOccasion | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [blogPreviews, setBlogPreviews] = useState<BlogPostPreview[]>([]);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const fetchInitialData = async () => {
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

    fetchInitialData();
  }, [trackEvent]);

  useEffect(() => {
    const fetchBlogPreviews = async () => {
      if (selectedOccasion?.blogTag) {
        const { data } = await supabase
          .from('blog_posts')
          .select('id, title, excerpt')
          .eq('tag', selectedOccasion.blogTag)
          .limit(2);
        setBlogPreviews(data || []);
      } else {
        setBlogPreviews([]);
      }
    };

    fetchBlogPreviews();
  }, [selectedOccasion]);

  const handleSelect = (occasion: SpeechOccasion) => {
    setSelectedOccasion(occasion);
    trackEvent('select_occasion', 'Practice', occasion.name);
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
      <FavoriteOccasions onSelectFavorite={handleSelect} />
      <RecentOccasions onSelectRecent={handleSelect} />
      
      {selectedOccasion && (
        <div className="mt-6">
          <OccasionDetails
            occasion={selectedOccasion}
            favorites={favorites}
            setFavorites={setFavorites}
            blogPreviews={blogPreviews}
          />
        </div>
      )}
    </div>
  );
};

export default PracticePage;

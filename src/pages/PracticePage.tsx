import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SpeechOccasion } from '@/types/speechOccasions';
import { SPEECH_OCCASIONS } from '@/data/speechOccasions';
import SpeechOccasionSelector from '@/components/speech/SpeechOccasionSelector';
import FavoriteOccasions from '@/components/speech/FavoriteOccasions';
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
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
    };

    fetchFavorites();
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

  const handleSelectFavorite = (name: string) => {
    const occasion = SPEECH_OCCASIONS
      .flatMap(cat => cat.occasions)
      .find(occ => occ.name === name);

    if (occasion) {
      setSelectedOccasion(occasion);
      trackEvent('select_favorite', 'Practice', name);
    }
  };

  const handleStartPractice = () => {
    if (selectedOccasion) {
      trackEvent('start_practice', 'Practice', selectedOccasion.name);
      navigate('/chat', { state: { occasion: selectedOccasion } });
    }
  };

  const handleViewBlogPosts = () => {
    if (selectedOccasion?.blogTag) {
      trackEvent('view_blog_posts', 'Practice', selectedOccasion.blogTag);
      navigate(`/blog?tag=${selectedOccasion.blogTag}`);
    }
  };

  const handleToggleFavorite = async () => {
    if (!selectedOccasion) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to save favorites.',
        variant: 'destructive',
      });
      return;
    }

    const isFavorite = favorites.includes(selectedOccasion.name);
    trackEvent(
      isFavorite ? 'remove_favorite' : 'save_favorite',
      'Practice',
      selectedOccasion.name
    );

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('occasion_name', selectedOccasion.name);

      if (error) {
        console.error('Error removing favorite:', error);
        toast({
          title: 'Error',
          description: 'Failed to remove favorite.',
          variant: 'destructive',
        });
        return;
      }

      setFavorites(favorites.filter(name => name !== selectedOccasion.name));
      toast({
        title: 'Removed from Favorites',
        description: `${selectedOccasion.name} removed from your favorites.`,
      });
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, occasion_name: selectedOccasion.name });

      if (error) {
        console.error('Error saving favorite:', error);
        toast({
          title: 'Error',
          description: 'Failed to save favorite.',
          variant: 'destructive',
        });
        return;
      }

      setFavorites([...favorites, selectedOccasion.name]);
      toast({
        title: 'Added to Favorites',
        description: `${selectedOccasion.name} added to your favorites.`,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Practice Your Speech | SpeakEasyAI</title>
        <meta 
          name="description" 
          content="Practice your speech for any occasion with AI-powered feedback." 
        />
      </Helmet>

      <h1 className="text-3xl font-bold mb-4">Practice Your Speech</h1>
      
      <SpeechOccasionSelector onSelectOccasion={setSelectedOccasion} />
      
      <FavoriteOccasions 
        favorites={favorites}
        onSelectFavorite={handleSelectFavorite}
      />

      {selectedOccasion && (
        <OccasionDetails
          occasion={selectedOccasion}
          isFavorite={favorites.includes(selectedOccasion.name)}
          blogPreviews={blogPreviews}
          onStartPractice={handleStartPractice}
          onViewBlogPosts={handleViewBlogPosts}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
};

export default PracticePage;

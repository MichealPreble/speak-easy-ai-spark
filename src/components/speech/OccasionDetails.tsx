
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SpeechOccasion } from '@/types/speechOccasions';
import RelatedBlogPosts from './RelatedBlogPosts';

interface Template {
  id: string;
  title: string;
  content: string;
}

interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
}

interface OccasionDetailsProps {
  occasion: SpeechOccasion;
  favorites: string[];
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  blogPreviews: BlogPostPreview[];
  setBlogPreviews: React.Dispatch<React.SetStateAction<BlogPostPreview[]>>;
}

const OccasionDetails: React.FC<OccasionDetailsProps> = ({ 
  occasion, 
  favorites, 
  setFavorites, 
  blogPreviews, 
  setBlogPreviews 
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [practiceNote, setPracticeNote] = useState('');
  const { trackEvent } = useAnalytics();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch blog previews and templates
  useEffect(() => {
    const fetchData = async () => {
      if (occasion.blogTag) {
        const { data } = await supabase
          .from('blog_posts')
          .select('id, title, excerpt')
          .eq('tag', occasion.blogTag)
          .limit(2);
        setBlogPreviews(data || []);
      }
      if (occasion.templateId) {
        const { data } = await supabase
          .from('templates')
          .select('id, title, content')
          .eq('occasion_name', occasion.name);
        setTemplates(data || []);
        if (data && data.length > 0) {
          trackEvent('view_template', 'SpeechPractice', occasion.name);
        }
      }
    };
    fetchData();
  }, [occasion, setBlogPreviews, trackEvent]);

  // Save to recent occasions
  useEffect(() => {
    const saveRecent = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existing } = await supabase
          .from('recent_occasions')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(1);
        if (existing && existing.length >= 5) {
          await supabase
            .from('recent_occasions')
            .delete()
            .eq('id', existing[0].id);
        }
        await supabase
          .from('recent_occasions')
          .upsert({ user_id: user.id, occasion_name: occasion.name });
      }
    };
    saveRecent();
    trackEvent('view_occasion_details', 'SpeechPractice', occasion.name);
  }, [occasion, trackEvent]);

  const handleStartPractice = () => {
    const saveSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('practice_sessions')
          .insert({ user_id: user.id, occasion_name: occasion.name, notes: practiceNote || undefined });
        if (error) {
          toast({
            title: 'Error',
            description: 'Failed to save practice session.',
            variant: 'destructive',
          });
          return;
        }
        if (practiceNote) {
          trackEvent('add_practice_note', 'SpeechPractice', occasion.name);
        }
      }
    };
    saveSession();
    trackEvent('start_practice', 'SpeechPractice', occasion.name);
    navigate('/chat', { state: { occasion } });
  };

  const handleViewBlogPosts = () => {
    if (occasion.blogTag) {
      trackEvent('view_blog_posts', 'SpeechPractice', occasion.blogTag);
      navigate(`/blog?tag=${occasion.blogTag}`);
    }
  };

  const handleToggleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to save favorites.',
        variant: 'destructive',
      });
      return;
    }

    const isFavorite = favorites.includes(occasion.name);
    trackEvent(isFavorite ? 'remove_favorite' : 'save_favorite', 'SpeechPractice', occasion.name);

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('occasion_name', occasion.name);
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to remove favorite.',
          variant: 'destructive',
        });
        return;
      }
      setFavorites(favorites.filter((name) => name !== occasion.name));
      toast({
        title: 'Removed from Favorites',
        description: `${occasion.name} removed from your favorites.`,
      });
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, occasion_name: occasion.name });
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to save favorite.',
          variant: 'destructive',
        });
        return;
      }
      setFavorites([...favorites, occasion.name]);
      toast({
        title: 'Added to Favorites',
        description: `${occasion.name} added to your favorites.`,
      });
    }
  };

  const handleSelectTemplate = (template: Template) => {
    trackEvent('select_template', 'SpeechPractice', `${occasion.name}:${template.title}`);
    navigate('/chat', { state: { occasion, template: template.content } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selected: {occasion.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600"><strong>Occasion:</strong> {occasion.occasion}</p>
        <p className="text-sm text-gray-600"><strong>Examples:</strong> {occasion.examples}</p>
        <p className="text-sm text-gray-600"><strong>Audience Size:</strong> {occasion.audienceSize}</p>
        <p className="text-sm text-gray-600"><strong>Task:</strong> {occasion.task}</p>
        <div className="mt-4">
          <Input
            placeholder="Add a note for this practice session (e.g., key points, feedback)"
            value={practiceNote}
            onChange={(e) => setPracticeNote(e.target.value)}
            className="mb-4"
            aria-label="Practice session note"
          />
          <div className="flex gap-4">
            <Button
              onClick={handleStartPractice}
              aria-label={`Start practicing for ${occasion.name}`}
            >
              Start Practicing
            </Button>
            {occasion.blogTag && (
              <Button
                variant="outline"
                onClick={handleViewBlogPosts}
                aria-label={`View blog posts for ${occasion.name}`}
              >
                View Related Blog Posts
              </Button>
            )}
            <Button
              variant={favorites.includes(occasion.name) ? 'destructive' : 'secondary'}
              onClick={handleToggleFavorite}
              aria-label={favorites.includes(occasion.name) ? `Remove ${occasion.name} from favorites` : `Add ${occasion.name} to favorites`}
            >
              {favorites.includes(occasion.name) ? 'Remove Favorite' : 'Add to Favorites'}
            </Button>
          </div>
        </div>
        {templates.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Suggested Templates</h3>
            <div className="space-y-4">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <CardTitle className="text-md">{template.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{template.content.substring(0, 100)}...</p>
                    <Button
                      variant="link"
                      onClick={() => handleSelectTemplate(template)}
                      aria-label={`Select template: ${template.title}`}
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        <RelatedBlogPosts blogPreviews={blogPreviews} blogTag={occasion.blogTag || ''} />
      </CardContent>
    </Card>
  );
};

export default OccasionDetails;

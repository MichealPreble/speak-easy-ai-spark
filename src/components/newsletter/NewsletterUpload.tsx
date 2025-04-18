import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/context/AuthContext';

interface NewsletterIssue {
  title: string;
  slug: string;
  content: string;
  preview_text: string;
  published_at: string;
  featured_image?: string;
  blogTag?: string;
}

const NewsletterUpload: React.FC = () => {
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();
  const [formData, setFormData] = useState<NewsletterIssue>({
    title: '',
    slug: '',
    content: '',
    preview_text: '',
    published_at: new Date().toISOString(),
    featured_image: '',
    blogTag: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user metadata includes admin role
  const isAdmin = user?.user_metadata?.is_admin === true;

  if (!user || !isAdmin) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: edgeError } = await supabase.functions.invoke('upload-newsletter', {
        body: formData,
      });

      if (edgeError) {
        throw new Error(edgeError.message);
      }

      trackEvent('upload_newsletter', 'Newsletter', formData.title);
      setFormData({
        title: '',
        slug: '',
        content: '',
        preview_text: '',
        published_at: new Date().toISOString(),
        featured_image: '',
        blogTag: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-md border-none shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">Upload Newsletter Issue</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            placeholder="Issue Title"
            value={formData.title}
            onChange={handleChange}
            required
            aria-label="Newsletter title"
          />
          <Input
            name="slug"
            placeholder="Issue Slug (e.g., fresh-frames-january-2026)"
            value={formData.slug}
            onChange={handleChange}
            required
            aria-label="Newsletter slug"
          />
          <Textarea
            name="content"
            placeholder="Issue HTML Content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            aria-label="Newsletter content"
          />
          <Input
            name="preview_text"
            placeholder="Preview Text"
            value={formData.preview_text}
            onChange={handleChange}
            required
            aria-label="Newsletter preview text"
          />
          <Input
            name="published_at"
            type="datetime-local"
            value={formData.published_at.slice(0, 16)}
            onChange={(e) => setFormData({ ...formData, published_at: new Date(e.target.value).toISOString() })}
            required
            aria-label="Publish date"
          />
          <Input
            name="featured_image"
            placeholder="Featured Image URL"
            value={formData.featured_image}
            onChange={handleChange}
            aria-label="Featured image URL"
          />
          <Input
            name="blogTag"
            placeholder="Blog Tag (e.g., keynote)"
            value={formData.blogTag}
            onChange={handleChange}
            aria-label="Blog tag"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-white"
            aria-label="Upload newsletter issue"
          >
            {isLoading ? 'Uploading...' : 'Upload Issue'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewsletterUpload;

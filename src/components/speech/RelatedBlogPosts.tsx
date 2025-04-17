
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShareButtons from '@/components/blog/ShareButtons';

interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
}

interface RelatedBlogPostsProps {
  posts: BlogPostPreview[];
}

const RelatedBlogPosts = ({ posts }: RelatedBlogPostsProps) => {
  if (!posts.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Related Blog Posts</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle className="text-md">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{post.excerpt}</p>
              <ShareButtons title={post.title} url={`/blog/${post.id}`} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedBlogPosts;

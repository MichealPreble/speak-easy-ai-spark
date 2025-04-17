
import BlogPost from "@/components/blog/BlogPost";
import { useParams } from "react-router-dom";
import { BLOG_POSTS } from "@/data/blogPosts";
import SEO from "@/components/SEO";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(post => post.slug === slug);
  
  // Create the current URL for sharing
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  return (
    <>
      <SEO 
        title={post ? `${post.title} - SpeakEasyAI Blog` : "Blog Post - SpeakEasyAI"}
        description={post?.excerpt || "Read our latest blog post about public speaking tips and strategies."}
        ogType="article"
      />
      <div className="bg-background min-h-screen">
        <div className="container mx-auto">
          <BlogPost />
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;

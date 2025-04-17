
import BlogHeader from "@/components/blog/BlogHeader";
import BlogList from "@/components/blog/BlogList";
import FeaturedPosts from "@/components/blog/FeaturedPosts";
import { BLOG_POSTS } from "@/data/blogPosts";
import SEO from "@/components/SEO";

const BlogPage = () => {
  return (
    <>
      <SEO 
        title="SpeakEasyAI Blog - Public Speaking Tips & Strategies"
        description="Explore our blog for expert insights, practical tips, and proven strategies to improve your public speaking skills and overcome presentation anxiety."
      />
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <BlogHeader />
          <FeaturedPosts posts={BLOG_POSTS.slice(0, 3)} />
          <BlogList posts={BLOG_POSTS} />
        </div>
      </div>
    </>
  );
};

export default BlogPage;

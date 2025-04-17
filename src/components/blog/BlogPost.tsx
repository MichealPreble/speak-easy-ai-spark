
import { Calendar, Clock, User, ArrowLeft, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useParams, Navigate } from "react-router-dom";
import { BlogPost as BlogPostType } from "./BlogCard";
import { BLOG_POSTS } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Find the post with the matching slug
  const post = BLOG_POSTS.find((post) => post.slug === slug);
  
  // If no post is found, redirect to the blog list
  if (!post) {
    return <Navigate to="/blog" replace />;
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back button */}
      <Link to="/blog">
        <Button variant="ghost" className="mb-8 pl-0 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to all articles
        </Button>
      </Link>
      
      {/* Post header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {post.category}
          </Badge>
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {post.author}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {post.date}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readTime} read
          </div>
        </div>
      </div>
      
      {/* Post content */}
      <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
        <p>
          Public speaking is a skill that can significantly impact both your personal and professional life. Whether you're presenting to colleagues, speaking at a conference, or delivering a toast at a wedding, the ability to communicate effectively in front of others is invaluable.
        </p>
        <p>
          In this article, we'll explore {post.title.toLowerCase()} and provide practical advice to help you become a more confident and compelling speaker.
        </p>
        <h2>Why {post.category} Matters</h2>
        <p>
          When it comes to public speaking, {post.category.toLowerCase()} plays a crucial role in how your message is received. Studies have shown that audiences are more likely to remember and be persuaded by speakers who demonstrate strong {post.category.toLowerCase()} skills.
        </p>
        <p>
          Consider these statistics:
        </p>
        <ul>
          <li>73% of audiences say that a speaker's delivery is more important than content</li>
          <li>Visual aids can improve learning by up to 400%</li>
          <li>The first 30 seconds of your speech determine whether people will pay attention</li>
        </ul>
        <h2>Key Strategies for Improvement</h2>
        <p>
          Improving your {post.category.toLowerCase()} doesn't happen overnight, but with consistent practice and the right techniques, you can make significant progress. Here are some effective strategies:
        </p>
        <ol>
          <li><strong>Practice regularly</strong> - Set aside time each week to practice speaking in front of others or recording yourself.</li>
          <li><strong>Seek feedback</strong> - Ask trusted colleagues or friends for honest feedback on your speaking style.</li>
          <li><strong>Watch expert speakers</strong> - Study TED talks and other presentations to learn from skilled communicators.</li>
          <li><strong>Join a speaking club</strong> - Organizations like Toastmasters provide a supportive environment to develop your skills.</li>
          <li><strong>Use technology</strong> - Tools like SpeakEasyAI can provide personalized feedback to help you improve.</li>
        </ol>
        <h2>Common Challenges and Solutions</h2>
        <p>
          Even experienced speakers face challenges. Here are some common issues and how to address them:
        </p>
        <h3>Nervousness and Anxiety</h3>
        <p>
          It's normal to feel nervous before speaking publicly. Try deep breathing exercises, visualization techniques, and thorough preparation to reduce anxiety.
        </p>
        <h3>Audience Engagement</h3>
        <p>
          Keeping your audience engaged requires a combination of compelling content, dynamic delivery, and interaction. Use stories, questions, and varied speaking patterns to maintain interest.
        </p>
        <h3>Technical Difficulties</h3>
        <p>
          Always have a backup plan for visual aids and technology. Practice your presentation without slides so you can continue confidently if technical issues arise.
        </p>
        <h2>Conclusion</h2>
        <p>
          Developing strong public speaking skills is a journey that requires patience and practice. By focusing on {post.category.toLowerCase()} and implementing the strategies outlined in this article, you can become a more effective and confident communicator.
        </p>
        <p>
          Remember that every great speaker started as a beginner. With the right approach and consistent effort, you can transform your public speaking abilities and open new opportunities in your personal and professional life.
        </p>
      </div>
      
      {/* Share and comments section */}
      <div className="border-t pt-8">
        <h3 className="text-xl font-semibold mb-4">Join the conversation</h3>
        <div className="flex gap-4 items-center">
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Leave a comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;

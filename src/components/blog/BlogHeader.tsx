
import { Bot } from "lucide-react";

const BlogHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
        <Bot className="h-6 w-6 text-primary" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">SpeakEasy AI Blog</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Insights, tips, and strategies to help you become a better public speaker
      </p>
    </div>
  );
};

export default BlogHeader;

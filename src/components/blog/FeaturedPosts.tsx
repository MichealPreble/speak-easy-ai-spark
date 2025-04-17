
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogPost } from "./BlogCard";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface FeaturedPostsProps {
  posts: BlogPost[];
}

const FeaturedPosts = ({ posts }: FeaturedPostsProps) => {
  // Take only the first 3 posts for featured section
  const featuredPosts = posts.slice(0, 3);

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Featured Articles</h2>
        <Link 
          to="/blog" 
          className="text-primary flex items-center hover:underline"
        >
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredPosts.map((post) => (
          <Card key={post.id} className="h-full flex flex-col hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <Badge variant="outline" className="w-fit bg-primary/10 text-primary">
                {post.category}
              </Badge>
              <CardTitle className="mt-2 mb-1">
                <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription>{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {post.excerpt}
              </p>
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <Link 
                to={`/blog/${post.slug}`} 
                className="text-primary flex items-center hover:underline text-sm"
              >
                Read more
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPosts;

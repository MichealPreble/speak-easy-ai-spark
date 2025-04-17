
import { Calendar, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
  slug: string;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {post.category}
          </Badge>
          <span className="text-sm text-muted-foreground">{post.readTime} read</span>
        </div>
        <CardTitle className="mt-2 mb-1 text-xl">
          <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription>{post.excerpt}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="line-clamp-3 text-sm text-muted-foreground">
          {post.excerpt}
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1" />
          {post.author}
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {post.date}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;


import { useState } from "react";
import BlogCard, { BlogPost } from "./BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

interface BlogListProps {
  posts: BlogPost[];
}

const BlogList = ({ posts }: BlogListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract unique categories and tags
  const categories = Array.from(new Set(posts.map((post) => post.category)));
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  // Filter posts based on search term, category, and tags
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    const matchesTags = selectedTags.length > 0 
      ? selectedTags.every(tag => post.tags.includes(tag)) 
      : true;
    
    return matchesSearch && matchesCategory && matchesTags;
  });

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge 
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Clear filters button - only show if filters are applied */}
        {(searchTerm || selectedCategory || selectedTags.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredPosts.length} of {posts.length} articles
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {/* No results message */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="mt-4"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogList;

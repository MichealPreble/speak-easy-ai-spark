
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ChatSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ChatSearch = ({ searchQuery, setSearchQuery }: ChatSearchProps) => {
  return (
    <div className="p-3 border-b border-secondary-light/30 dark:border-secondary-dark/30 backdrop-blur-sm">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 bg-white/20 dark:bg-black/20 backdrop-blur-sm border-secondary-light/30 dark:border-secondary-dark/30"
          aria-label="Search messages"
        />
      </div>
    </div>
  );
};

export default ChatSearch;

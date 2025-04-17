
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  disabled?: boolean;
}

export const SearchInput = ({ searchQuery, setSearchQuery, disabled }: SearchInputProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search messages..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-9 bg-white/20 dark:bg-black/20 backdrop-blur-sm border-secondary-light/30 dark:border-secondary-dark/30"
        aria-label="Search messages"
        disabled={disabled}
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={() => setSearchQuery("")}
          aria-label="Clear search"
          disabled={disabled}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};

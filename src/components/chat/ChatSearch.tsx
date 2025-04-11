
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ChatSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ChatSearch = ({ searchQuery, setSearchQuery }: ChatSearchProps) => {
  const isMobile = useIsMobile();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Sample filter options
  const filterOptions = [
    { id: "questions", label: "Questions" },
    { id: "replies", label: "Replies" },
    { id: "unread", label: "Unread" },
    { id: "flagged", label: "Flagged" }
  ];
  
  const toggleFilter = (filterId: string) => {
    setActiveFilters(current => 
      current.includes(filterId) 
        ? current.filter(id => id !== filterId)
        : [...current, filterId]
    );
  };
  
  const clearFilters = () => setActiveFilters([]);
  
  // Filter content component shared between mobile and desktop
  const FilterContent = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Filter Messages</h3>
        {activeFilters.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-xs h-7 px-2"
          >
            Clear all
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {filterOptions.map(option => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`filter-${option.id}`} 
              checked={activeFilters.includes(option.id)}
              onCheckedChange={() => toggleFilter(option.id)}
            />
            <label 
              htmlFor={`filter-${option.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
  
  // Mobile filter with bottom sheet or drawer
  const MobileFilter = () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Filter className="h-4 w-4" />
          {activeFilters.length > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-4 min-w-4 text-[10px] flex items-center justify-center p-0" 
              variant="secondary"
            >
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <FilterContent />
      </DrawerContent>
    </Drawer>
  );
  
  // Desktop filter with popover
  const DesktopFilter = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Filter className="h-4 w-4" />
          {activeFilters.length > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-4 min-w-4 text-[10px] flex items-center justify-center p-0" 
              variant="secondary"
            >
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <FilterContent />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="p-3 border-b border-secondary-light/30 dark:border-secondary-dark/30 backdrop-blur-sm">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
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
        
        {isMobile ? <MobileFilter /> : <DesktopFilter />}
      </div>
      
      {/* Show active filters badges */}
      {activeFilters.length > 0 && (
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {activeFilters.map(filterId => (
            <Badge 
              key={filterId} 
              variant="secondary"
              className="px-2 py-0.5 text-xs flex items-center gap-1"
            >
              {filterOptions.find(o => o.id === filterId)?.label}
              <button 
                onClick={() => toggleFilter(filterId)}
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Remove ${filterId} filter`}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatSearch;


import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchInput } from "./SearchInput";
import { MobileFilter } from "./MobileFilter";
import { DesktopFilter } from "./DesktopFilter";
import { ActiveFilterBadges } from "./ActiveFilterBadges";

interface ChatSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ChatSearch = ({ searchQuery, setSearchQuery }: ChatSearchProps) => {
  const isMobile = useIsMobile();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
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
  
  const clearFilters = () => {
    setActiveFilters([]);
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  return (
    <div className="p-3 border-b border-secondary-light/30 dark:border-secondary-dark/30 backdrop-blur-sm">
      <div className="flex gap-2 items-center">
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {isMobile ? (
          <MobileFilter 
            filterOptions={filterOptions}
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
          />
        ) : (
          <DesktopFilter 
            filterOptions={filterOptions}
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
          />
        )}
      </div>
      
      <ActiveFilterBadges 
        activeFilters={activeFilters}
        filterOptions={filterOptions}
        toggleFilter={toggleFilter}
      />
    </div>
  );
};

export default ChatSearch;

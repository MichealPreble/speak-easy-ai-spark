
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FilterOption {
  id: string;
  label: string;
}

interface ActiveFilterBadgesProps {
  filterOptions: Record<string, boolean>;
  searchQuery: string;
  onClearAll: () => void;
}

export const ActiveFilterBadges = ({
  filterOptions,
  searchQuery,
  onClearAll
}: ActiveFilterBadgesProps) => {
  const activeFilters = Object.entries(filterOptions)
    .filter(([_, isActive]) => isActive)
    .map(([key]) => key);
  
  const hasActiveFilters = activeFilters.length > 0 || searchQuery.trim().length > 0;
  
  if (!hasActiveFilters) return null;
  
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      {activeFilters.map(filter => (
        <Badge 
          key={filter} 
          variant="secondary"
          className="px-2 py-0.5 text-xs flex items-center gap-1"
        >
          {filter.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        </Badge>
      ))}
      
      {searchQuery.trim() && (
        <Badge
          variant="secondary"
          className="px-2 py-0.5 text-xs flex items-center gap-1"
        >
          Search: {searchQuery}
        </Badge>
      )}
      
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-7 px-2 ml-2"
          onClick={onClearAll}
        >
          Clear all
        </Button>
      )}
    </div>
  );
};

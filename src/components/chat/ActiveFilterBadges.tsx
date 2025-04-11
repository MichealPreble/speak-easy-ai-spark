
import { Badge } from "@/components/ui/badge";

interface ActiveFilterBadgesProps {
  activeFilters: string[];
  filterOptions: { id: string; label: string }[];
  toggleFilter: (filterId: string) => void;
}

export const ActiveFilterBadges = ({
  activeFilters,
  filterOptions,
  toggleFilter
}: ActiveFilterBadgesProps) => {
  if (activeFilters.length === 0) return null;
  
  return (
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
  );
};

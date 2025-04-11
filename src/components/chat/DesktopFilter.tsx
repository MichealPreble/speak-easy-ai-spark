
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FilterOptions } from "./FilterOptions";

interface DesktopFilterProps {
  filterOptions: { id: string; label: string }[];
  activeFilters: string[];
  toggleFilter: (filterId: string) => void;
  clearFilters: () => void;
}

export const DesktopFilter = ({
  filterOptions,
  activeFilters,
  toggleFilter,
  clearFilters
}: DesktopFilterProps) => {
  return (
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
        <FilterOptions
          options={filterOptions}
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
          clearFilters={clearFilters}
        />
      </PopoverContent>
    </Popover>
  );
};

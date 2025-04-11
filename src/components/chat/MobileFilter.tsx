
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { FilterOptions } from "./FilterOptions";

interface MobileFilterProps {
  filterOptions: { id: string; label: string }[];
  activeFilters: string[];
  toggleFilter: (filterId: string) => void;
  clearFilters: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
}

export const MobileFilter = ({
  filterOptions,
  activeFilters,
  toggleFilter,
  clearFilters,
  isDrawerOpen,
  setIsDrawerOpen
}: MobileFilterProps) => {
  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
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
      <DrawerContent className="max-h-[85vh] px-0">
        <div className="py-1 px-4 border-b flex items-center justify-between">
          <h3 className="font-medium">Message Filters</h3>
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
        <FilterOptions
          options={filterOptions}
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
          clearFilters={clearFilters}
        />
      </DrawerContent>
    </Drawer>
  );
};

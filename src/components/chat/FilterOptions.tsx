
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterOptionsProps {
  options: FilterOption[];
  activeFilters: string[];
  toggleFilter: (filterId: string) => void;
  clearFilters: () => void;
}

export const FilterOptions = ({
  options,
  activeFilters,
  toggleFilter,
  clearFilters
}: FilterOptionsProps) => {
  return (
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
        {options.map(option => (
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
};

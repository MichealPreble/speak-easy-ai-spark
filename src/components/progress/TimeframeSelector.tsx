
import React from "react";
import { Button } from "@/components/ui/button";

interface TimeframeSelectorProps {
  timeframe: 'week' | 'month' | 'all';
  setTimeframe: (timeframe: 'week' | 'month' | 'all') => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ 
  timeframe, 
  setTimeframe 
}) => {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="text-sm font-medium">Timeframe:</span>
      <div className="flex space-x-1 rounded-md bg-muted p-1">
        <Button 
          variant={timeframe === 'week' ? "default" : "ghost"}
          size="sm" 
          onClick={() => setTimeframe('week')}
          className="h-8 text-xs"
        >
          Last 7 Days
        </Button>
        <Button 
          variant={timeframe === 'month' ? "default" : "ghost"}
          size="sm" 
          onClick={() => setTimeframe('month')}
          className="h-8 text-xs"
        >
          Last 30 Days
        </Button>
        <Button 
          variant={timeframe === 'all' ? "default" : "ghost"}
          size="sm" 
          onClick={() => setTimeframe('all')}
          className="h-8 text-xs"
        >
          All Time
        </Button>
      </div>
    </div>
  );
};

export default TimeframeSelector;

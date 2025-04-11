
import React from "react";
import { Button } from "@/components/ui/button";
import { LineChart as LineChartIcon, BarChart as BarChartIcon, Activity } from "lucide-react";

interface ChartControlsProps {
  chartType: 'line' | 'bar' | 'composed';
  setChartType: (type: 'line' | 'bar' | 'composed') => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({ chartType, setChartType }) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant={chartType === 'line' ? "default" : "outline"} 
        size="sm" 
        onClick={() => setChartType('line')}
        className="h-8 px-2"
      >
        <LineChartIcon className="h-4 w-4 mr-1" />
        Line
      </Button>
      <Button 
        variant={chartType === 'bar' ? "default" : "outline"} 
        size="sm" 
        onClick={() => setChartType('bar')}
        className="h-8 px-2"
      >
        <BarChartIcon className="h-4 w-4 mr-1" />
        Bar
      </Button>
      <Button 
        variant={chartType === 'composed' ? "default" : "outline"} 
        size="sm" 
        onClick={() => setChartType('composed')}
        className="h-8 px-2"
      >
        <Activity className="h-4 w-4 mr-1" />
        Combined
      </Button>
    </div>
  );
};

export default ChartControls;

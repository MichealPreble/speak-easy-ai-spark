
import React from "react";
import { ComposedChart, Line, Bar, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface ChartElement {
  key: string;
  name: string;
  color: string;
}

interface ComposedChartViewProps {
  data: any[];
  dataKeys: {
    x: string;
    areas: ChartElement[];
    lines: ChartElement[];
    bars: ChartElement[];
  };
  className?: string;
}

const ComposedChartView: React.FC<ComposedChartViewProps> = ({ 
  data, 
  dataKeys,
  className = "h-full" 
}) => {
  // Combine all chart elements for the config
  const allElements = [
    ...dataKeys.areas, 
    ...dataKeys.lines, 
    ...dataKeys.bars
  ];
  
  // Create a config object for ChartContainer
  const chartConfig = allElements.reduce((config, element) => {
    config[element.key] = { color: element.color };
    return config;
  }, {} as Record<string, { color: string }>);

  return (
    <ChartContainer className={className} config={chartConfig}>
      <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={dataKeys.x} />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend verticalAlign="bottom" />
        
        {dataKeys.areas.map((area, index) => (
          <Area 
            key={index}
            type="monotone" 
            dataKey={area.key} 
            name={area.name} 
            fill={`var(--color-${area.key})`}
            stroke={`var(--color-${area.key})`}
            fillOpacity={0.3}
          />
        ))}
        
        {dataKeys.lines.map((line, index) => (
          <Line 
            key={index}
            type="monotone" 
            dataKey={line.key} 
            name={line.name} 
            stroke={`var(--color-${line.key})`}
          />
        ))}
        
        {dataKeys.bars.map((bar, index) => (
          <Bar 
            key={index}
            dataKey={bar.key} 
            name={bar.name} 
            fill={`var(--color-${bar.key})`}
          />
        ))}
      </ComposedChart>
    </ChartContainer>
  );
};

export default ComposedChartView;

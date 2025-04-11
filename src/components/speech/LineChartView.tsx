
import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface LineChartViewProps {
  data: any[];
  dataKeys: {
    x: string;
    lines: Array<{
      key: string;
      name: string;
      color: string;
      activeDot?: object;
      strokeWidth?: number;
    }>;
  };
  className?: string;
}

const LineChartView: React.FC<LineChartViewProps> = ({ 
  data, 
  dataKeys,
  className = "h-full" 
}) => {
  // Create a config object for ChartContainer
  const chartConfig = dataKeys.lines.reduce((config, line) => {
    config[line.key] = { color: line.color };
    return config;
  }, {} as Record<string, { color: string }>);

  return (
    <ChartContainer className={className} config={chartConfig}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={dataKeys.x} />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend verticalAlign="bottom" />
        {dataKeys.lines.map((line, index) => (
          <Line 
            key={index}
            type="monotone" 
            dataKey={line.key} 
            name={line.name} 
            stroke={`var(--color-${line.key})`}
            activeDot={line.activeDot} 
            strokeWidth={line.strokeWidth}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
};

export default LineChartView;

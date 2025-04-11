
import React from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface BarChartViewProps {
  data: any[];
  dataKeys: {
    x: string;
    bars: Array<{
      key: string;
      name: string;
      color: string;
    }>;
  };
  className?: string;
}

const BarChartView: React.FC<BarChartViewProps> = ({ 
  data, 
  dataKeys,
  className = "h-full" 
}) => {
  // Create a config object for ChartContainer
  const chartConfig = dataKeys.bars.reduce((config, bar) => {
    config[bar.key] = { color: bar.color };
    return config;
  }, {} as Record<string, { color: string }>);

  return (
    <ChartContainer className={className} config={chartConfig}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={dataKeys.x} />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend verticalAlign="bottom" />
        {dataKeys.bars.map((bar, index) => (
          <Bar 
            key={index}
            dataKey={bar.key} 
            name={bar.name} 
            fill={`var(--color-${bar.key})`}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
};

export default BarChartView;

import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const chartConfig = dataKeys.lines.reduce((config, line) => {
    config[line.key] = { color: line.color };
    return config;
  }, {} as Record<string, { color: string }>);

  return (
    <ChartContainer className={className} config={chartConfig}>
      <LineChart data={data} margin={{ 
        top: 10, 
        right: isMobile ? 10 : 30, 
        left: isMobile ? -20 : 0, 
        bottom: 5 
      }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey={dataKeys.x} 
          tick={{ fontSize: isMobile ? 10 : 12 }}
          interval={isMobile ? 2 : 0}
        />
        <YAxis 
          tick={{ fontSize: isMobile ? 10 : 12 }}
          width={isMobile ? 30 : 40}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend 
          verticalAlign="bottom" 
          height={isMobile ? 50 : 36}
          wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }}
        />
        {dataKeys.lines.map((line, index) => (
          <Line 
            key={index}
            type="monotone" 
            dataKey={line.key} 
            name={line.name} 
            stroke={`var(--color-${line.key})`}
            activeDot={line.activeDot} 
            strokeWidth={isMobile ? 1 : line.strokeWidth}
            dot={!isMobile}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
};

export default LineChartView;

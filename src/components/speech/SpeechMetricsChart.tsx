
import React from "react";
import { 
  ResponsiveContainer,
  LineChart, 
  Line,  
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { SpeechAnalysisResult } from "@/utils/speech/types";

interface SpeechMetricsChartProps {
  data: {
    pace?: number;
    clarity?: number;
    hesitations?: number;
    fillerWords?: number;
    timestamp?: number;
  }[];
  height?: number;
  metricToShow?: 'pace' | 'clarity' | 'hesitations' | 'all';
}

const SpeechMetricsChart: React.FC<SpeechMetricsChartProps> = ({
  data,
  height = 100,
  metricToShow = 'all'
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-20 flex items-center justify-center text-xs text-muted-foreground">
        Not enough data to display chart
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    index,
    pace: item.pace || 0,
    clarity: item.clarity || 0,
    hesitations: item.hesitations || 0,
    fillerWords: item.fillerWords || 0,
    time: item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : index.toString()
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ChartContainer
        className="h-full w-full"
        config={{
          pace: { color: "#F97316" },
          clarity: { color: "#9b87f5" },
          hesitations: { color: "#8E9196" },
          fillerWords: { color: "#1A1F2C" }
        }}
      >
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="index" tick={false} />
          <YAxis hide={true} />
          <Tooltip content={<ChartTooltipContent />} />
          
          {(metricToShow === 'all' || metricToShow === 'pace') && (
            <Line 
              type="monotone" 
              dataKey="pace" 
              name="Pace (WPM)" 
              stroke="var(--color-pace)" 
              dot={false} 
              strokeWidth={1.5}
            />
          )}
          
          {(metricToShow === 'all' || metricToShow === 'clarity') && (
            <Line 
              type="monotone" 
              dataKey="clarity" 
              name="Clarity" 
              stroke="var(--color-clarity)" 
              dot={false}
              strokeWidth={1.5}
            />
          )}
          
          {(metricToShow === 'all' || metricToShow === 'hesitations') && (
            <Line 
              type="monotone" 
              dataKey="hesitations" 
              name="Hesitations" 
              stroke="var(--color-hesitations)" 
              dot={false}
              strokeWidth={1.5}
            />
          )}
          
          <Line 
            type="monotone" 
            dataKey="fillerWords" 
            name="Filler Words" 
            stroke="var(--color-fillerWords)" 
            dot={false}
            strokeWidth={1.5}
            hide={metricToShow !== 'all'}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default SpeechMetricsChart;

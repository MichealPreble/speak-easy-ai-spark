
import React from "react";
import LineChartView from "./LineChartView";
import BarChartView from "./BarChartView";
import ComposedChartView from "./ComposedChartView";

// Define more specific types for the line and bar chart configurations
interface LineChartConfig {
  x: string;
  lines: Array<{
    key: string;
    name: string;
    color: string;
    activeDot?: object;
    strokeWidth?: number;
  }>;
}

interface BarChartConfig {
  x: string;
  bars: Array<{
    key: string;
    name: string;
    color: string;
  }>;
}

interface ComposedChartConfig {
  x: string;
  areas: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  lines: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  bars: Array<{
    key: string;
    name: string;
    color: string;
  }>;
}

// Define the return type for getChartConfig
interface ChartConfigs {
  line: LineChartConfig;
  bar: BarChartConfig;
  composed?: ComposedChartConfig;
}

interface ChartTabContentProps {
  tabValue: string;
  chartType: 'line' | 'bar' | 'composed';
  processedData: any[];
}

/**
 * ChartTabContent component version 3
 * Displays different chart types based on selected tab and chart type
 */
const ChartTabContent: React.FC<ChartTabContentProps> = ({ 
  tabValue, 
  chartType, 
  processedData 
}) => {
  // Define chart configurations for each tab
  const getChartConfig = (): ChartConfigs => {
    const baseX = "time";
    
    switch(tabValue) {
      case 'clarity':
        return {
          line: {
            x: baseX,
            lines: [
              { key: "clarityScore", name: "Clarity", color: "#9b87f5", activeDot: { r: 8 }, strokeWidth: 2 }
            ]
          },
          bar: {
            x: baseX,
            bars: [
              { key: "clarityScore", name: "Clarity", color: "#9b87f5" }
            ]
          }
        };
        
      case 'pace':
        return {
          line: {
            x: baseX,
            lines: [
              { key: "pace", name: "Pace (WPM)", color: "#F97316", activeDot: { r: 8 }, strokeWidth: 2 },
              { key: "rhythmScore", name: "Rhythm", color: "#7E69AB", activeDot: { r: 6 } }
            ]
          },
          bar: {
            x: baseX,
            bars: [
              { key: "pace", name: "Pace (WPM)", color: "#F97316" },
              { key: "rhythmScore", name: "Rhythm", color: "#7E69AB" }
            ]
          }
        };
        
      case 'hesitations':
        return {
          line: {
            x: baseX,
            lines: [
              { key: "hesitationCount", name: "Hesitations", color: "#8E9196" },
              { key: "fillerWordCount", name: "Filler Words", color: "#1A1F2C" }
            ]
          },
          bar: {
            x: baseX,
            bars: [
              { key: "hesitationCount", name: "Hesitations", color: "#8E9196" },
              { key: "fillerWordCount", name: "Filler Words", color: "#1A1F2C" }
            ]
          }
        };
        
      case 'all':
      default:
        return {
          line: {
            x: baseX,
            lines: [
              { key: "clarityScore", name: "Clarity", color: "#9b87f5", activeDot: { r: 8 } },
              { key: "rhythmScore", name: "Rhythm", color: "#7E69AB" },
              { key: "pace", name: "Pace (WPM)", color: "#F97316" },
              { key: "hesitationCount", name: "Hesitations", color: "#8E9196" },
              { key: "fillerWordCount", name: "Filler Words", color: "#1A1F2C" }
            ]
          },
          bar: {
            x: baseX,
            bars: [
              { key: "clarityScore", name: "Clarity", color: "#9b87f5" },
              { key: "rhythmScore", name: "Rhythm", color: "#7E69AB" },
              { key: "pace", name: "Pace (WPM)", color: "#F97316" },
              { key: "hesitationCount", name: "Hesitations", color: "#8E9196" },
              { key: "fillerWordCount", name: "Filler Words", color: "#1A1F2C" }
            ]
          },
          composed: {
            x: baseX,
            areas: [
              { key: "clarityScore", name: "Clarity", color: "#9b87f5" }
            ],
            lines: [
              { key: "rhythmScore", name: "Rhythm", color: "#7E69AB" },
              { key: "pace", name: "Pace (WPM)", color: "#F97316" }
            ],
            bars: [
              { key: "hesitationCount", name: "Hesitations", color: "#8E9196" },
              { key: "fillerWordCount", name: "Filler Words", color: "#1A1F2C" }
            ]
          }
        };
    }
  };

  const config = getChartConfig();
  
  // Added unique identifier for v3 to ensure change detection
  console.log("ChartTabContent v3: Rendering with", { chartType, tabValue, configKeys: Object.keys(config) });
  
  // Fixed TypeScript errors by using specific type checking and providing fallbacks
  if (chartType === 'line') {
    return <LineChartView data={processedData} dataKeys={config.line} />;
  }
  
  if (chartType === 'bar') {
    return <BarChartView data={processedData} dataKeys={config.bar} />;
  }
  
  if (chartType === 'composed' && config.composed) {
    return <ComposedChartView data={processedData} dataKeys={config.composed} />;
  }
  
  // Default fallback to line chart with explicit type
  return <LineChartView data={processedData} dataKeys={config.line} />;
};

export default ChartTabContent;

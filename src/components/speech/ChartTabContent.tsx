
import React from "react";
import LineChartView from "./LineChartView";
import BarChartView from "./BarChartView";
import ComposedChartView from "./ComposedChartView";

interface ChartTabContentProps {
  tabValue: string;
  chartType: 'line' | 'bar' | 'composed';
  processedData: any[];
}

const ChartTabContent: React.FC<ChartTabContentProps> = ({ 
  tabValue, 
  chartType, 
  processedData 
}) => {
  // Define chart configurations for each tab
  const getChartConfig = () => {
    const baseX = "time";
    
    switch(tabValue) {
      case 'clarity':
        return {
          line: {
            x: baseX,
            lines: [
              { key: "clarityScore", name: "Clarity", color: "#9b87f5", activeDot: { r: 8 }, strokeWidth: 2 }
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
          }
        };
        
      case 'hesitations':
        return {
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
  
  if (chartType === 'line') {
    const lineConfig = tabValue === 'hesitations' ? config.bar : config.line;
    return <LineChartView data={processedData} dataKeys={lineConfig} />;
  }
  
  if (chartType === 'bar') {
    const barConfig = tabValue === 'clarity' || tabValue === 'pace' ? config.line : config.bar;
    return <BarChartView data={processedData} dataKeys={barConfig} />;
  }
  
  if (chartType === 'composed' && tabValue === 'all') {
    return <ComposedChartView data={processedData} dataKeys={config.composed} />;
  }
  
  // Default fallback to line chart for composed on non-all tabs
  const fallbackConfig = tabValue === 'hesitations' ? config.bar : config.line;
  return <LineChartView data={processedData} dataKeys={fallbackConfig} />;
};

export default ChartTabContent;

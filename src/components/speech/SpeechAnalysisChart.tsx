
import React, { useState } from "react";
import { SpeechAnalysisResult } from "@/utils/speech/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChartEmptyState from "./ChartEmptyState";
import ChartInsights from "./ChartInsights";
import ChartControls from "./ChartControls";
import ChartTabContent from "./ChartTabContent";
import { useSpeechChartData } from "@/hooks/useSpeechChartData";

interface SpeechAnalysisChartProps {
  data: SpeechAnalysisResult[];
  title?: string;
  description?: string;
  showControls?: boolean;
}

const SpeechAnalysisChart: React.FC<SpeechAnalysisChartProps> = ({
  data,
  title = "Speech Analysis Trends",
  description = "Track your progress over time",
  showControls = true
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'composed'>('line');
  const { processedData, insights } = useSpeechChartData(data);

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <ChartEmptyState />
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
          
          {showControls && (
            <div className="w-full sm:w-auto">
              <ChartControls 
                chartType={chartType} 
                setChartType={setChartType}
              />
            </div>
          )}
        </div>
        
        <ChartInsights insights={insights} />
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <Tabs defaultValue="all" className="h-[300px] sm:h-[400px]">
          <TabsList className="mb-4 w-full overflow-x-auto flex-nowrap whitespace-nowrap">
            <TabsTrigger value="all">All Metrics</TabsTrigger>
            <TabsTrigger value="clarity">Clarity</TabsTrigger>
            <TabsTrigger value="pace">Pace & Rhythm</TabsTrigger>
            <TabsTrigger value="hesitations">Hesitations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="h-full">
            <ChartTabContent tabValue="all" chartType={chartType} processedData={processedData} />
          </TabsContent>
          
          <TabsContent value="clarity" className="h-full">
            <ChartTabContent tabValue="clarity" chartType={chartType} processedData={processedData} />
          </TabsContent>
          
          <TabsContent value="pace" className="h-full">
            <ChartTabContent tabValue="pace" chartType={chartType} processedData={processedData} />
          </TabsContent>
          
          <TabsContent value="hesitations" className="h-full">
            <ChartTabContent tabValue="hesitations" chartType={chartType} processedData={processedData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SpeechAnalysisChart;

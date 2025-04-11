
import React, { useState, useMemo } from "react";
import { 
  ResponsiveContainer,
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ComposedChart,
  Area
} from "recharts";
import { 
  SpeechAnalysisResult,
  BatchStatistics 
} from "@/utils/speech/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { 
  LineChart as LineChartIcon, 
  BarChart as BarChartIcon, 
  Activity,
  Clock,
  Volume2,
  SpeakerWave,
  PauseCircle
} from "lucide-react";

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
  
  // Process the data to add date labels and ensure all metrics are present
  const processedData = useMemo(() => {
    return data.map((item, index) => {
      const date = item.timestamp ? new Date(item.timestamp) : new Date();
      return {
        id: index,
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clarityScore: item.clarity.score,
        clarityRating: item.clarity.rating,
        pace: item.pace,
        fillerWordCount: item.fillerWordCount,
        hesitationCount: item.hesitationCount,
        rhythmScore: item.rhythmScore,
        processingTimeMs: item.metrics?.processingTimeMs || 0,
        cacheHit: item.metrics?.cacheHit || false
      };
    });
  }, [data]);

  // Calculate statistical insights
  const insights = useMemo(() => {
    if (processedData.length === 0) return null;
    
    const avgClarity = processedData.reduce((sum, item) => sum + item.clarityScore, 0) / processedData.length;
    const avgPace = processedData.reduce((sum, item) => sum + item.pace, 0) / processedData.length;
    const avgRhythm = processedData.reduce((sum, item) => sum + item.rhythmScore, 0) / processedData.length;
    const totalFillerWords = processedData.reduce((sum, item) => sum + item.fillerWordCount, 0);
    const totalHesitations = processedData.reduce((sum, item) => sum + item.hesitationCount, 0);
    
    // Calculate trend (positive or negative) based on first and last entries
    const clarityTrend = processedData.length > 1 ? 
      processedData[processedData.length - 1].clarityScore - processedData[0].clarityScore : 0;
    const paceTrend = processedData.length > 1 ? 
      processedData[processedData.length - 1].pace - processedData[0].pace : 0;
    
    return {
      avgClarity: avgClarity.toFixed(1),
      avgPace: avgPace.toFixed(1),
      avgRhythm: avgRhythm.toFixed(1),
      totalFillerWords,
      totalHesitations,
      clarityTrend,
      paceTrend,
      sessions: processedData.length
    };
  }, [processedData]);

  // If no data, show empty state
  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-60 text-center">
          <Activity className="h-12 w-12 text-primary/30 mb-4" />
          <p className="text-muted-foreground">No speech analysis data available yet.</p>
          <p className="text-xs text-muted-foreground mt-2">Practice speaking to see your progress visualized.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {showControls && (
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
          )}
        </div>
        
        {insights && (
          <div className="grid grid-cols-2 sm:grid-cols-4 mt-4 gap-2 text-center">
            <div className="bg-primary/5 rounded-md p-2">
              <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center">
                <SpeakerWave className="h-3 w-3 mr-1" /> Clarity
              </div>
              <div className="font-medium">{insights.avgClarity}</div>
            </div>
            <div className="bg-primary/5 rounded-md p-2">
              <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center">
                <Clock className="h-3 w-3 mr-1" /> Pace
              </div>
              <div className="font-medium">{insights.avgPace} WPM</div>
            </div>
            <div className="bg-primary/5 rounded-md p-2">
              <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center">
                <Volume2 className="h-3 w-3 mr-1" /> Rhythm
              </div>
              <div className="font-medium">{insights.avgRhythm}</div>
            </div>
            <div className="bg-primary/5 rounded-md p-2">
              <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center">
                <PauseCircle className="h-3 w-3 mr-1" /> Hesitations
              </div>
              <div className="font-medium">{insights.totalHesitations}</div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="h-[300px]">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Metrics</TabsTrigger>
            <TabsTrigger value="clarity">Clarity</TabsTrigger>
            <TabsTrigger value="pace">Pace & Rhythm</TabsTrigger>
            <TabsTrigger value="hesitations">Hesitations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="h-full">
            <ChartContainer 
              className="h-full" 
              config={{
                clarity: { color: "#9b87f5" },
                rhythm: { color: "#7E69AB" },
                pace: { color: "#F97316" },
                hesitations: { color: "#8E9196" },
                fillerWords: { color: "#1A1F2C" }
              }}
            >
              {chartType === 'line' && (
                <LineChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend verticalAlign="bottom" />
                  <Line type="monotone" dataKey="clarityScore" name="Clarity" stroke="var(--color-clarity)" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="rhythmScore" name="Rhythm" stroke="var(--color-rhythm)" />
                  <Line type="monotone" dataKey="pace" name="Pace (WPM)" stroke="var(--color-pace)" />
                  <Line type="monotone" dataKey="hesitationCount" name="Hesitations" stroke="var(--color-hesitations)" />
                  <Line type="monotone" dataKey="fillerWordCount" name="Filler Words" stroke="var(--color-fillerWords)" />
                </LineChart>
              )}
              
              {chartType === 'bar' && (
                <BarChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend verticalAlign="bottom" />
                  <Bar dataKey="clarityScore" name="Clarity" fill="var(--color-clarity)" />
                  <Bar dataKey="rhythmScore" name="Rhythm" fill="var(--color-rhythm)" />
                  <Bar dataKey="pace" name="Pace (WPM)" fill="var(--color-pace)" />
                  <Bar dataKey="hesitationCount" name="Hesitations" fill="var(--color-hesitations)" />
                  <Bar dataKey="fillerWordCount" name="Filler Words" fill="var(--color-fillerWords)" />
                </BarChart>
              )}
              
              {chartType === 'composed' && (
                <ComposedChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend verticalAlign="bottom" />
                  <Area type="monotone" dataKey="clarityScore" name="Clarity" fill="var(--color-clarity)" stroke="var(--color-clarity)" fillOpacity={0.3} />
                  <Line type="monotone" dataKey="rhythmScore" name="Rhythm" stroke="var(--color-rhythm)" />
                  <Line type="monotone" dataKey="pace" name="Pace (WPM)" stroke="var(--color-pace)" />
                  <Bar dataKey="hesitationCount" name="Hesitations" fill="var(--color-hesitations)" />
                  <Bar dataKey="fillerWordCount" name="Filler Words" fill="var(--color-fillerWords)" />
                </ComposedChart>
              )}
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="clarity" className="h-full">
            <ChartContainer 
              className="h-full" 
              config={{
                clarity: { color: "#9b87f5" },
              }}
            >
              <LineChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="bottom" />
                <Line type="monotone" dataKey="clarityScore" name="Clarity" stroke="var(--color-clarity)" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="pace" className="h-full">
            <ChartContainer 
              className="h-full" 
              config={{
                pace: { color: "#F97316" },
                rhythm: { color: "#7E69AB" },
              }}
            >
              <LineChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="bottom" />
                <Line type="monotone" dataKey="pace" name="Pace (WPM)" stroke="var(--color-pace)" activeDot={{ r: 8 }} strokeWidth={2} />
                <Line type="monotone" dataKey="rhythmScore" name="Rhythm" stroke="var(--color-rhythm)" activeDot={{ r: 6 }} />
              </LineChart>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="hesitations" className="h-full">
            <ChartContainer 
              className="h-full" 
              config={{
                hesitations: { color: "#8E9196" },
                fillerWords: { color: "#1A1F2C" },
              }}
            >
              <BarChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="bottom" />
                <Bar dataKey="hesitationCount" name="Hesitations" fill="var(--color-hesitations)" />
                <Bar dataKey="fillerWordCount" name="Filler Words" fill="var(--color-fillerWords)" />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SpeechAnalysisChart;

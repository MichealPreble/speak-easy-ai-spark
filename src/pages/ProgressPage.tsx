
import React, { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import SpeechAnalysisChart from "@/components/speech/SpeechAnalysisChart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SpeechAnalysisResult } from "@/utils/speech/types";
import { CalendarIcon, Clock, Download, RefreshCw } from "lucide-react";

// Mock data generator for demonstration purposes
const generateMockData = (count = 10): SpeechAnalysisResult[] => {
  const mockData: SpeechAnalysisResult[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - count);
  
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Generate data with an improving trend
    const clarityBase = 5 + (i * 0.3); // Starts at 5, improves over time
    const paceBase = 140 + (i * 2); // Starts at 140, increases slightly
    const hesitationBase = Math.max(1, 5 - (i * 0.4)); // Starts at 5, decreases over time
    const fillerBase = Math.max(1, 6 - (i * 0.5)); // Starts at 6, decreases over time
    
    // Add some randomness
    const clarity = Math.min(10, Math.max(1, clarityBase + (Math.random() * 2 - 1)));
    const pace = Math.min(180, Math.max(120, paceBase + (Math.random() * 20 - 10)));
    const hesitations = Math.max(0, Math.round(hesitationBase + (Math.random() * 2 - 1)));
    const fillers = Math.max(0, Math.round(fillerBase + (Math.random() * 2 - 1)));
    
    mockData.push({
      clarity: {
        score: clarity,
        rating: clarity >= 8 ? 'excellent' : clarity >= 6 ? 'good' : clarity >= 4 ? 'fair' : 'needs improvement',
        suggestions: []
      },
      pace: pace,
      fillerWordCount: fillers,
      hesitationCount: hesitations,
      rhythmScore: Math.min(10, Math.max(1, 6 + (i * 0.3) + (Math.random() * 2 - 1))),
      timestamp: date.getTime(),
      metrics: {
        startTime: date.getTime() - 60000,
        endTime: date.getTime(),
        processingTimeMs: Math.round(100 + Math.random() * 200),
        cacheHit: Math.random() > 0.7,
        deviceInfo: {
          platform: Math.random() > 0.7 ? 'Windows' : 'macOS',
          browser: Math.random() > 0.5 ? 'Chrome' : 'Firefox',
          isMobile: false,
          connectionType: 'wifi'
        }
      }
    });
  }
  
  return mockData;
};

const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [speechData, setSpeechData] = useState<SpeechAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

  // Load data on initial render
  useEffect(() => {
    loadData();
  }, []);

  // Filter data based on selected timeframe
  const filteredData = React.useMemo(() => {
    if (timeframe === 'all') return speechData;
    
    const now = new Date().getTime();
    const threshold = timeframe === 'week' 
      ? now - (7 * 24 * 60 * 60 * 1000) // 7 days
      : now - (30 * 24 * 60 * 60 * 1000); // 30 days
    
    return speechData.filter(item => (item.timestamp || 0) >= threshold);
  }, [speechData, timeframe]);

  const loadData = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to fetch user's speech data
      // For demo purposes, we're generating mock data
      const data = generateMockData(15);
      setSpeechData(data);
      
      toast({
        title: "Data Loaded",
        description: `Loaded ${data.length} speech sessions.`,
      });
    } catch (error) {
      console.error("Error loading speech data:", error);
      toast({
        title: "Error Loading Data",
        description: "Could not load your speech analysis data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    try {
      const dataStr = JSON.stringify(speechData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `speech-analysis-export-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Export Complete",
        description: "Your speech analysis data has been exported."
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export your speech analysis data.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <SEO 
        title="Your Progress - Speech Analysis Metrics"
        description="Track your speech improvement over time with detailed analytics on clarity, pace, and hesitations."
        ogType="website"
      />
      <div className="container mx-auto py-8 px-4 min-h-screen bg-gradient-to-b from-primary-light/10 to-white dark:from-primary-dark/10 dark:to-background">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-primary">Your Progress</h1>
              <p className="text-muted-foreground backdrop-blur-sm inline-block px-4 py-2 rounded-full bg-white/50 dark:bg-black/20 border border-secondary-light/20 dark:border-secondary-dark/20">
                Track your speaking improvements over time
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadData}
                disabled={loading}
                className="h-9"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportData}
                className="h-9"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
          
          <div className="mb-6 flex items-center gap-4">
            <span className="text-sm font-medium">Timeframe:</span>
            <div className="flex space-x-1 rounded-md bg-muted p-1">
              <Button 
                variant={timeframe === 'week' ? "default" : "ghost"}
                size="sm" 
                onClick={() => setTimeframe('week')}
                className="h-8 text-xs"
              >
                Last 7 Days
              </Button>
              <Button 
                variant={timeframe === 'month' ? "default" : "ghost"}
                size="sm" 
                onClick={() => setTimeframe('month')}
                className="h-8 text-xs"
              >
                Last 30 Days
              </Button>
              <Button 
                variant={timeframe === 'all' ? "default" : "ghost"}
                size="sm" 
                onClick={() => setTimeframe('all')}
                className="h-8 text-xs"
              >
                All Time
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <SpeechAnalysisChart 
              data={filteredData} 
              title="Speech Analysis Trends"
              description={`Showing data for ${timeframe === 'week' ? 'the last 7 days' : timeframe === 'month' ? 'the last 30 days' : 'all time'}`}
            />
            
            <Tabs defaultValue="details">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="details">Session Details</TabsTrigger>
                  <TabsTrigger value="stats">Performance Stats</TabsTrigger>
                </TabsList>
                <div className="text-xs text-muted-foreground">
                  {filteredData.length} sessions shown
                </div>
              </div>
              
              <TabsContent value="details" className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><CalendarIcon className="h-4 w-4" /></TableHead>
                      <TableHead>Clarity</TableHead>
                      <TableHead>Pace</TableHead>
                      <TableHead>Rhythm</TableHead>
                      <TableHead>Hesitations</TableHead>
                      <TableHead>Fillers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'N/A'}
                            <div className="text-xs text-muted-foreground flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                item.clarity.rating === 'excellent' ? 'bg-green-500' :
                                item.clarity.rating === 'good' ? 'bg-blue-500' :
                                item.clarity.rating === 'fair' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}></div>
                              {item.clarity.score.toFixed(1)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 capitalize">
                              {item.clarity.rating}
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.pace.toFixed(0)} WPM
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.pace < 120 ? 'Slow' : item.pace > 160 ? 'Fast' : 'Good'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.rhythmScore.toFixed(1)}
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.rhythmScore >= 8 ? 'Excellent' : 
                               item.rhythmScore >= 6 ? 'Good' : 
                               item.rhythmScore >= 4 ? 'Fair' : 'Poor'}
                            </div>
                          </TableCell>
                          <TableCell>{item.hesitationCount}</TableCell>
                          <TableCell>{item.fillerWordCount}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                          No speech analysis data available for this timeframe.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="stats" className="rounded-md border p-4">
                {filteredData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Speech Quality Statistics</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium mb-1">Average Clarity Score</div>
                          <div className="text-2xl">
                            {(filteredData.reduce((sum, item) => sum + item.clarity.score, 0) / filteredData.length).toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Out of 10 possible points
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Average Pace</div>
                          <div className="text-2xl">
                            {(filteredData.reduce((sum, item) => sum + item.pace, 0) / filteredData.length).toFixed(0)} WPM
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Words per minute
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Average Rhythm Score</div>
                          <div className="text-2xl">
                            {(filteredData.reduce((sum, item) => sum + item.rhythmScore, 0) / filteredData.length).toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Out of 10 possible points
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Improvement Indicators</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium mb-1">Filler Word Reduction</div>
                          {filteredData.length >= 3 && (
                            <>
                              <div className="text-2xl">
                                {(() => {
                                  // Calculate average of first 3 sessions vs last 3
                                  const firstThree = filteredData.slice(0, 3);
                                  const lastThree = filteredData.slice(-3);
                                  const firstAvg = firstThree.reduce((sum, item) => sum + item.fillerWordCount, 0) / firstThree.length;
                                  const lastAvg = lastThree.reduce((sum, item) => sum + item.fillerWordCount, 0) / lastThree.length;
                                  const percentChange = ((firstAvg - lastAvg) / firstAvg) * 100;
                                  
                                  return percentChange > 0 
                                    ? <span className="text-green-500">-{percentChange.toFixed(0)}%</span>
                                    : <span className="text-red-500">+{Math.abs(percentChange).toFixed(0)}%</span>;
                                })()}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Comparing first 3 to last 3 sessions
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-1">Hesitation Reduction</div>
                          {filteredData.length >= 3 && (
                            <>
                              <div className="text-2xl">
                                {(() => {
                                  // Calculate average of first 3 sessions vs last 3
                                  const firstThree = filteredData.slice(0, 3);
                                  const lastThree = filteredData.slice(-3);
                                  const firstAvg = firstThree.reduce((sum, item) => sum + item.hesitationCount, 0) / firstThree.length;
                                  const lastAvg = lastThree.reduce((sum, item) => sum + item.hesitationCount, 0) / lastThree.length;
                                  const percentChange = ((firstAvg - lastAvg) / firstAvg) * 100;
                                  
                                  return percentChange > 0 
                                    ? <span className="text-green-500">-{percentChange.toFixed(0)}%</span>
                                    : <span className="text-red-500">+{Math.abs(percentChange).toFixed(0)}%</span>;
                                })()}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Comparing first 3 to last 3 sessions
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-1">Clarity Improvement</div>
                          {filteredData.length >= 3 && (
                            <>
                              <div className="text-2xl">
                                {(() => {
                                  // Calculate average of first 3 sessions vs last 3
                                  const firstThree = filteredData.slice(0, 3);
                                  const lastThree = filteredData.slice(-3);
                                  const firstAvg = firstThree.reduce((sum, item) => sum + item.clarity.score, 0) / firstThree.length;
                                  const lastAvg = lastThree.reduce((sum, item) => sum + item.clarity.score, 0) / lastThree.length;
                                  const percentChange = ((lastAvg - firstAvg) / firstAvg) * 100;
                                  
                                  return percentChange > 0 
                                    ? <span className="text-green-500">+{percentChange.toFixed(0)}%</span>
                                    : <span className="text-red-500">-{Math.abs(percentChange).toFixed(0)}%</span>;
                                })()}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Comparing first 3 to last 3 sessions
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No speech analysis data available for this timeframe.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressPage;

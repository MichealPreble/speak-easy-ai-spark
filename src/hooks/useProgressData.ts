
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { SpeechAnalysisResult } from "@/utils/speech/types";

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

export const useProgressData = () => {
  const { toast } = useToast();
  const [speechData, setSpeechData] = useState<SpeechAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

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

  // Export data as JSON file
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

  // Load data on initial render
  useEffect(() => {
    loadData();
  }, []);

  return {
    speechData,
    filteredData,
    loading,
    timeframe,
    setTimeframe,
    loadData,
    exportData
  };
};


import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProgressData {
  id: string;
  userId: string;
  date: string;
  score: number;
  duration: number;
  wordCount: number;
  pace: number;
  clarity: number;
  fillerWords: number;
  notes?: string;
}

export function useProgressData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProgressData[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  
  // Filter data based on selected timeframe
  const filteredData = useCallback(() => {
    if (timeframe === 'all') return data;
    
    const now = new Date();
    const pastDate = new Date();
    
    if (timeframe === 'week') {
      pastDate.setDate(now.getDate() - 7);
    } else if (timeframe === 'month') {
      pastDate.setDate(now.getDate() - 30);
    }
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= pastDate && itemDate <= now;
    });
  }, [data, timeframe]);
  
  // Load progress data
  const loadData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Mock data for now - would be replaced with actual API call
      const mockData: ProgressData[] = [
        {
          id: '1',
          userId: user.id,
          date: new Date().toISOString(),
          score: 85,
          duration: 120,
          wordCount: 350,
          pace: 175,
          clarity: 8.2,
          fillerWords: 3
        },
        {
          id: '2',
          userId: user.id,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          score: 78,
          duration: 90,
          wordCount: 280,
          pace: 187,
          clarity: 7.5,
          fillerWords: 5
        },
        {
          id: '3',
          userId: user.id,
          date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
          score: 92,
          duration: 180,
          wordCount: 520,
          pace: 173,
          clarity: 9.1,
          fillerWords: 1
        }
      ];
      
      setData(mockData);
    } catch (error: any) {
      toast({
        title: "Failed to load progress data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);
  
  // Export data as CSV
  const exportData = useCallback(() => {
    const filtered = filteredData();
    if (filtered.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no progress data available for the selected timeframe."
      });
      return;
    }
    
    // Create CSV content
    const headers = "Date,Score,Duration (s),Word Count,Pace (WPM),Clarity,Filler Words,Notes\n";
    const rows = filtered.map(item => 
      `${new Date(item.date).toLocaleDateString()},${item.score},${item.duration},${item.wordCount},${item.pace},${item.clarity},${item.fillerWords},${item.notes || ""}`
    ).join("\n");
    const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `speech_progress_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Data exported",
      description: `Progress data for the ${timeframe === 'week' ? 'last 7 days' : timeframe === 'month' ? 'last 30 days' : 'all time'} has been exported.`
    });
  }, [filteredData, timeframe, toast]);
  
  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  return {
    filteredData: filteredData(),
    loading,
    timeframe,
    setTimeframe,
    loadData,
    exportData
  };
}

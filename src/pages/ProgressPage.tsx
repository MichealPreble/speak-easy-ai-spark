
import React from "react";
import SEO from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import SpeechAnalysisChart from "@/components/speech/SpeechAnalysisChart";
import ProgressHeader from "@/components/progress/ProgressHeader";
import TimeframeSelector from "@/components/progress/TimeframeSelector";
import SessionsTable from "@/components/progress/SessionsTable";
import StatsPanel from "@/components/progress/StatsPanel";
import { useProgressData } from "@/hooks/useProgressData";

const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const analytics = useAnalytics();
  const { 
    filteredData, 
    loading, 
    timeframe, 
    setTimeframe, 
    loadData, 
    exportData 
  } = useProgressData();

  return (
    <>
      <SEO 
        title="Your Progress - Speech Analysis Metrics"
        description="Track your speech improvement over time with detailed analytics on clarity, pace, and hesitations."
        ogType="website"
      />
      <div className="container mx-auto py-8 px-4 min-h-screen bg-gradient-to-b from-primary-light/10 to-white dark:from-primary-dark/10 dark:to-background">
        <div className="max-w-5xl mx-auto w-full">
          <ProgressHeader 
            loading={loading}
            onRefresh={loadData}
            onExport={exportData}
          />
          
          <TimeframeSelector 
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
          
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
                <SessionsTable data={filteredData} />
              </TabsContent>
              
              <TabsContent value="stats" className="rounded-md border p-4">
                <StatsPanel data={filteredData} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressPage;

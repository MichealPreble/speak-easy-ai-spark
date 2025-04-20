
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, FileText, BarChart, Clock } from "lucide-react";
import { formatDuration } from "@/utils/formatTime";
import { MetricCard } from "./MetricCard";

interface SessionSummaryPanelProps {
  isActive: boolean;
  duration: number;
  wordCount: number;
  wpm: number | null;
  cadenceMetrics: {
    averagePauseMs: number | null;
    cadenceScore: number | null;
  };
}

export function SessionSummaryPanel({
  isActive,
  duration,
  wordCount,
  wpm,
  cadenceMetrics
}: SessionSummaryPanelProps) {
  // Don't show panel while speaking
  if (isActive) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Session Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <MetricCard
          icon={Timer}
          title="Duration"
          value={formatDuration(duration)}
          description="Total speaking time"
        />
        <MetricCard
          icon={FileText}
          title="Words"
          value={wordCount.toString()}
          description="Total word count"
        />
        <MetricCard
          icon={BarChart}
          title="Pace"
          value={wpm ? `${wpm} WPM` : "—"}
          description="Words per minute"
        />
        <MetricCard
          icon={Clock}
          title="Cadence"
          value={cadenceMetrics.cadenceScore ? `${cadenceMetrics.cadenceScore}/100` : "—"}
          description={cadenceMetrics.averagePauseMs 
            ? `${Math.round(cadenceMetrics.averagePauseMs)}ms avg pause`
            : "No cadence data"}
        />
      </CardContent>
    </Card>
  );
}

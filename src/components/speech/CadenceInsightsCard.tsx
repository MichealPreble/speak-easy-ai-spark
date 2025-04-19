
import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowDown, 
  ArrowUp 
} from "lucide-react";
import type { CadenceMetrics } from "@/hooks/speech/useSpeechInsights";

interface CadenceInsightsCardProps {
  cadence: CadenceMetrics;
}

export function CadenceInsightsCard({ cadence }: CadenceInsightsCardProps) {
  const { averagePauseMs, cadenceScore, feedback } = cadence;
  
  const getTrendIcon = () => {
    if (averagePauseMs === null) return null;
    return averagePauseMs < 500 ? (
      <ArrowUp className="w-4 h-4 text-destructive" />
    ) : averagePauseMs > 1500 ? (
      <ArrowDown className="w-4 h-4 text-destructive" />
    ) : null;
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">Speech Rhythm</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2 tracking-tight flex items-center justify-center gap-2">
            {cadenceScore !== null ? (
              <>
                {cadenceScore}
                <span className="text-base font-normal text-muted-foreground">/100</span>
              </>
            ) : "—"}
            {getTrendIcon()}
          </div>
          <p className={cn("text-sm font-medium", feedback.color)}>
            {feedback.text}
          </p>
          {averagePauseMs && (
            <p className="text-xs text-muted-foreground mt-2">
              Average pause: {Math.round(averagePauseMs)}ms
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

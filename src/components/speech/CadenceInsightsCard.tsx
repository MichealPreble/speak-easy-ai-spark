
import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowDown, 
  ArrowUp,
  Clock,
  ActivitySquare 
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
      <ArrowUp className="w-4 h-4 text-destructive" title="Too rushed" />
    ) : averagePauseMs > 1500 ? (
      <ArrowDown className="w-4 h-4 text-destructive" title="Too choppy" />
    ) : (
      <ActivitySquare className="w-4 h-4 text-green-600" title="Well-paced" />
    );
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold flex items-center gap-2">
          Speech Rhythm
          {getTrendIcon()}
        </CardTitle>
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
          </div>
          <p className={cn("text-sm font-medium", feedback.color)}>
            {feedback.text}
          </p>
          {averagePauseMs && (
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-2">
              <Clock className="w-3 h-3" />
              <span>Average pause: {Math.round(averagePauseMs)}ms</span>
            </div>
          )}
          
          {/* Visual rhythm indicator */}
          {averagePauseMs && (
            <div className="mt-3 pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-1">Speech Rhythm:</p>
              <div className="flex items-center justify-center gap-1 h-4">
                {Array.from({ length: 5 }).map((_, i) => {
                  let width = "w-1";
                  if (averagePauseMs < 500) {
                    width = i < 4 ? "w-1" : "w-3"; // Rushed: short-short-short-short-long
                  } else if (averagePauseMs > 1500) {
                    width = i % 2 === 0 ? "w-3" : "w-1"; // Choppy: long-short-long-short-long
                  } else {
                    width = "w-2"; // Balanced: medium-medium-medium-medium-medium
                  }
                  
                  return (
                    <div 
                      key={i}
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        width,
                        feedback.color === "text-green-600" ? "bg-green-500" : "bg-orange-400"
                      )}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

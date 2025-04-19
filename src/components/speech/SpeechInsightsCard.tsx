
import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWpmFeedback } from "@/hooks/speech/useSpeechInsights";

interface SpeechInsightsCardProps {
  wpm: number | null;
}

export function SpeechInsightsCard({ wpm }: SpeechInsightsCardProps) {
  const feedback = getWpmFeedback(wpm);
  
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">Speaking Rate</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2 tracking-tight">
            {wpm !== null ? `${wpm} WPM` : "—"}
          </div>
          <p className={cn("text-sm font-medium", feedback.color)}>
            {feedback.text}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

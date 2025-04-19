
import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SpeechInsightsCardProps {
  wpm: number | null;
}

const getWpmFeedback = (wpm: number | null) => {
  if (wpm === null) return { text: "Not speaking", color: "text-muted-foreground" };
  if (wpm < 70) return { text: "Too slow", color: "text-destructive" };
  if (wpm <= 89) return { text: "Somewhat slow", color: "text-yellow-500" };
  if (wpm <= 130) return { text: "Well-paced", color: "text-green-600" };
  if (wpm <= 150) return { text: "Somewhat fast", color: "text-yellow-500" };
  return { text: "Too fast", color: "text-destructive" };
};

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

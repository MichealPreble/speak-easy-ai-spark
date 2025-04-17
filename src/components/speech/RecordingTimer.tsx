
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Timer } from "lucide-react";

interface RecordingTimerProps {
  currentSeconds: number;
  maxSeconds: number;
}

const RecordingTimer: React.FC<RecordingTimerProps> = ({ 
  currentSeconds, 
  maxSeconds 
}) => {
  // Calculate remaining time and progress
  const remainingSeconds = Math.max(0, maxSeconds - currentSeconds);
  const progress = (currentSeconds / maxSeconds) * 100;
  
  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Determine color based on remaining time
  const getColorClass = () => {
    if (progress > 80) return "text-rose-500";
    if (progress > 60) return "text-amber-500";
    return "text-emerald-500";
  };
  
  return (
    <div className="p-2 bg-background/95 border-t border-border/30 backdrop-blur-md">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center text-sm">
          <Timer className="h-3.5 w-3.5 mr-1.5" />
          <span className="font-medium">1-Minute Practice</span>
        </div>
        <div className={`text-sm font-medium ${getColorClass()}`}>
          {formatTime(remainingSeconds)}
        </div>
      </div>
      
      <Progress value={progress} className="h-1.5" />
      
      <div className="text-xs text-muted-foreground mt-1 text-center">
        {remainingSeconds > 0
          ? "Keep going! Your speech will be analyzed when the time is up."
          : "Time's up! Finalizing your speech analysis..."}
      </div>
    </div>
  );
};

export default RecordingTimer;

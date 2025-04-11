
import React from "react";
import { Timer } from "lucide-react";

interface RecordingIndicatorProps {
  isActive: boolean;
}

const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({ isActive }) => {
  if (!isActive) return null;
  
  return (
    <div className="px-3 py-2 bg-rose-500/10 flex items-center text-sm text-rose-600 dark:text-rose-400">
      <Timer className="h-4 w-4 mr-2 animate-pulse" />
      <span className="font-medium">Recording in progress...</span>
    </div>
  );
};

export default RecordingIndicator;

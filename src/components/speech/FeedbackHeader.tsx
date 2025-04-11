
import React from "react";
import { Mic, ChevronUp, ChevronDown } from "lucide-react";
import RecordingIndicator from "./RecordingIndicator";

interface FeedbackHeaderProps {
  isActive: boolean;
  expanded: boolean;
  toggleExpanded: () => void;
}

const FeedbackHeader: React.FC<FeedbackHeaderProps> = ({
  isActive,
  expanded,
  toggleExpanded
}) => {
  return (
    <>
      <div className="flex items-center justify-between p-3 bg-primary/10 cursor-pointer" onClick={toggleExpanded}>
        <div className="flex items-center">
          <Mic className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">Real-time Feedback</h3>
        </div>
        <div className="flex items-center space-x-2">
          {isActive && (
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          )}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>
      
      {isActive && <RecordingIndicator isActive={isActive} />}
    </>
  );
};

export default FeedbackHeader;


import React from "react";

interface TrendIndicatorProps {
  label: string;
  value: string;
  showWarning: boolean;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ label, value, showWarning }) => {
  return (
    <div className={`flex items-center ${showWarning ? 'text-amber-500' : 'text-muted-foreground'}`}>
      <span className="w-3 h-3 rounded-full mr-1.5 bg-current opacity-70"></span>
      {label}: {value}
    </div>
  );
};

export default TrendIndicator;

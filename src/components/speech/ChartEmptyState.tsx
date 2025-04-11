
import React from "react";
import { Activity } from "lucide-react";
import { CardContent } from "@/components/ui/card";

const ChartEmptyState: React.FC = () => {
  return (
    <CardContent className="flex flex-col items-center justify-center h-60 text-center">
      <Activity className="h-12 w-12 text-primary/30 mb-4" />
      <p className="text-muted-foreground">No speech analysis data available yet.</p>
      <p className="text-xs text-muted-foreground mt-2">Practice speaking to see your progress visualized.</p>
    </CardContent>
  );
};

export default ChartEmptyState;

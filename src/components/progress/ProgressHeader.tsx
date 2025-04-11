
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

interface ProgressHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({ 
  loading, 
  onRefresh, 
  onExport 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-primary">Your Progress</h1>
        <p className="text-muted-foreground backdrop-blur-sm inline-block px-4 py-2 rounded-full bg-white/50 dark:bg-black/20 border border-secondary-light/20 dark:border-secondary-dark/20">
          Track your speaking improvements over time
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={loading}
          className="h-9"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExport}
          className="h-9"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>
  );
};

export default ProgressHeader;

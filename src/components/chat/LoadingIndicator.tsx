
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

interface LoadingIndicatorProps {
  isDarkMode: boolean;
}

const LoadingIndicator = ({ isDarkMode }: LoadingIndicatorProps) => {
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-2 max-w-[80%]">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="p-3 rounded-lg bg-muted flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-pulse delay-75"></div>
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-pulse delay-150"></div>
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;


import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";

interface ConnectionStatusIndicatorProps {
  onlineColor?: string;
  offlineColor?: string;
  errorColor?: string;
  pingUrl?: string;
  debounceMs?: number;
  className?: string;
}

type ConnectionStatus = 'online' | 'offline' | 'error';

const ConnectionStatusBadge = ({ status }: { status: ConnectionStatus }) => {
  const variants = {
    online: {
      variant: "default" as const,
      icon: Wifi,
      label: "Online",
      className: "bg-green-500 hover:bg-green-600",
    },
    offline: {
      variant: "secondary" as const,
      icon: WifiOff,
      label: "Offline",
      className: "bg-red-500 hover:bg-red-600",
    },
    error: {
      variant: "destructive" as const,
      icon: AlertCircle,
      label: "Connection Error",
      className: "bg-yellow-500 hover:bg-yellow-600",
    },
  };

  const { icon: Icon, label, className, variant } = variants[status];

  return (
    <Badge 
      variant={variant}
      className={`inline-flex items-center gap-1 ${className}`}
      data-testid={`connection-status-${status}`}
      aria-label={`Connection status: ${label}`}
      role="status"
      aria-live="polite"
    >
      <Icon className="h-3 w-3" />
      <span className="text-xs">{label}</span>
    </Badge>
  );
};

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  onlineColor = "bg-green-500 hover:bg-green-600",
  offlineColor = "bg-red-500 hover:bg-red-600",
  errorColor = "bg-yellow-500 hover:bg-yellow-600",
  pingUrl,
  debounceMs = 500,
  className,
}) => {
  const [status, setStatus] = useState<ConnectionStatus>(
    navigator.onLine ? "online" : "offline"
  );
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    let debounceTimeout: NodeJS.Timeout;

    const updateStatus = (newStatus: ConnectionStatus) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => setStatus(newStatus), debounceMs);
    };

    const handleOnline = () => updateStatus("online");
    const handleOffline = () => updateStatus("offline");

    // Add event listeners for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Optional ping to verify actual connectivity
    let pingInterval: NodeJS.Timeout | undefined;
    if (pingUrl) {
      pingInterval = setInterval(async () => {
        try {
          const response = await fetch(pingUrl, { method: "HEAD" });
          if (!response.ok) {
            updateStatus("error");
          } else {
            updateStatus("online");
          }
        } catch (e) {
          updateStatus("error");
        }
      }, 5000);
    }

    // Initial connectivity check
    if (pingUrl && navigator.onLine) {
      (async () => {
        try {
          const response = await fetch(pingUrl, { method: "HEAD" });
          if (!response.ok) {
            updateStatus("error");
          }
        } catch (e) {
          updateStatus("error");
        }
      })();
    }

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (pingInterval) clearInterval(pingInterval);
      clearTimeout(debounceTimeout);
    };
  }, [pingUrl, debounceMs]);

  const getTooltipContent = () => {
    switch (status) {
      case "online": 
        return "You are connected to the internet";
      case "offline": 
        return "You're currently offline";
      case "error": 
        return "There's an issue with your connection";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
        <TooltipTrigger asChild>
          <div className={`inline-block ${className}`}>
            <ConnectionStatusBadge status={status} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

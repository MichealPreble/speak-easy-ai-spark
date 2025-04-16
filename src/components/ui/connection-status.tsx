
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";

type ConnectionStatus = "online" | "offline" | "error";

interface ConnectionStatusBadgeProps {
  status: ConnectionStatus;
}

const ConnectionStatusBadge = ({ status }: ConnectionStatusBadgeProps) => {
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
      className: "bg-gray-500 hover:bg-gray-600",
    },
    error: {
      variant: "destructive" as const,
      icon: AlertCircle,
      label: "Connection Error",
      className: "",
    },
  };

  const { icon: Icon, label, className, variant } = variants[status];

  return (
    <Badge 
      variant={variant}
      className={`inline-flex items-center gap-1 ${className}`}
      data-testid={`connection-status-${status}`}
      aria-label={`Connection status: ${label}`}
    >
      <Icon className="h-3 w-3" />
      <span className="text-xs">{label}</span>
    </Badge>
  );
};

export function ConnectionStatusIndicator() {
  const [status, setStatus] = useState<ConnectionStatus>("online");

  useEffect(() => {
    const handleOnline = () => setStatus("online");
    const handleOffline = () => setStatus("offline");

    // Check initial status
    if (navigator.onLine) {
      setStatus("online");
    } else {
      setStatus("offline");
    }

    // Add event listeners for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Error handling example - could be expanded based on specific requirements
    const checkConnection = async () => {
      if (navigator.onLine) {
        try {
          const response = await fetch("/api/ping", { method: "HEAD" });
          if (!response.ok) {
            setStatus("error");
          }
        } catch (e) {
          setStatus("error");
        }
      }
    };

    // Check connection on mount
    checkConnection();

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">
            <ConnectionStatusBadge status={status} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {status === "online" && "You're connected to the internet"}
          {status === "offline" && "You're currently offline"}
          {status === "error" && "There's an issue with your connection"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

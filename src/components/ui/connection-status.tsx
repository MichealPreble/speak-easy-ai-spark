
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

interface ConnectionStatusIndicatorProps {
  onlineColor?: string;
  offlineColor?: string;
  errorColor?: string;
  pingUrl?: string;
  debounceMs?: number;
  className?: string;
}

type ConnectionStatus = 'online' | 'offline' | 'error';

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  onlineColor = 'bg-green-500 hover:bg-green-600',
  offlineColor = 'bg-red-500 hover:bg-red-600',
  errorColor = 'bg-yellow-500 hover:bg-yellow-600',
  pingUrl,
  debounceMs = 500,
  className,
}) => {
  const [status, setStatus] = useState<ConnectionStatus>(
    navigator.onLine ? 'online' : 'offline'
  );
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    let debounceTimeout: NodeJS.Timeout;

    const updateStatus = (newStatus: ConnectionStatus) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => setStatus(newStatus), debounceMs);
    };

    const handleOnline = () => updateStatus('online');
    const handleOffline = () => updateStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    let pingInterval: NodeJS.Timeout | undefined;
    if (pingUrl) {
      pingInterval = setInterval(async () => {
        try {
          await fetch(pingUrl, { mode: 'no-cors' });
          updateStatus('online');
        } catch {
          updateStatus('error');
        }
      }, 5000);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (pingInterval) clearInterval(pingInterval);
      clearTimeout(debounceTimeout);
    };
  }, [pingUrl, debounceMs]);

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: <Wifi className="w-4 h-4 mr-2" data-testid="icon-wifi" />,
          color: onlineColor,
          text: 'Online',
          tooltip: 'You are connected to the internet',
        };
      case 'offline':
        return {
          icon: <WifiOff className="w-4 h-4 mr-2" data-testid="icon-wifioff" />,
          color: offlineColor,
          text: 'Offline',
          tooltip: 'No internet connection',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4 mr-2" data-testid="icon-alertcircle" />,
          color: errorColor,
          text: 'Connection Error',
          tooltip: 'Experiencing connection issues',
        };
      default:
        return {
          icon: <WifiOff className="w-4 h-4 mr-2" data-testid="icon-wifioff" />,
          color: offlineColor,
          text: 'Offline',
          tooltip: 'No internet connection',
        };
    }
  };

  const { icon, color, text, tooltip } = getStatusConfig();

  return (
    <TooltipProvider>
      <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
        <TooltipTrigger asChild>
          <Badge
            data-testid="connection-status"
            className={`flex items-center cursor-pointer ${color} text-white ${className}`}
            role="status"
            aria-live="polite"
          >
            {icon}
            {text}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

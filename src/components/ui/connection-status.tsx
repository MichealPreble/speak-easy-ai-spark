
import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Wifi, WifiOff, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  const [isRetrying, setIsRetrying] = useState(false);

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: <Wifi className="w-4 h-4" data-testid="icon-wifi" />,
          color: onlineColor,
          label: 'Online',
          tooltip: 'Active',
        };
      case 'offline':
        return {
          icon: <WifiOff className="w-4 h-4" data-testid="icon-wifioff" />,
          color: offlineColor,
          label: 'Offline',
          tooltip: 'Disconnected',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4" data-testid="icon-alertcircle" />,
          color: errorColor,
          label: 'Connection Error',
          tooltip: 'Problems',
        };
      default:
        return {
          icon: <WifiOff className="w-4 h-4" data-testid="icon-wifioff" />,
          color: offlineColor,
          label: 'Offline',
          tooltip: 'Disconnected',
        };
    }
  };

  const checkConnection = useCallback(async () => {
    if (!pingUrl) return;
    
    try {
      setIsRetrying(true);
      await fetch(pingUrl, { mode: 'no-cors' });
      setStatus('online');
      if (status === 'error') {
        toast({
          title: "Connection restored",
          description: "You're back online",
          duration: 3000,
        });
      }
    } catch {
      setStatus('error');
    } finally {
      setIsRetrying(false);
    }
  }, [pingUrl, status]);

  const handleRetry = () => {
    checkConnection();
  };

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
      pingInterval = setInterval(checkConnection, 5000);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (pingInterval) clearInterval(pingInterval);
      clearTimeout(debounceTimeout);
    };
  }, [pingUrl, debounceMs, checkConnection]);

  const { icon, color, label, tooltip } = getStatusConfig();

  return (
    <TooltipProvider>
      <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1">
            <Badge
              data-testid="connection-status"
              className={`inline-flex items-center gap-1 ${color} text-white text-xs ${className}`}
              role="status"
              aria-live="polite"
              aria-label={`Connection status: ${label}`}
            >
              {icon}
              <span>{label}</span>
            </Badge>
            {status === 'error' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-6 px-2 ml-1" 
                onClick={handleRetry}
                disabled={isRetrying}
                data-testid="retry-button"
              >
                <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                <span className="sr-only">Retry connection</span>
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

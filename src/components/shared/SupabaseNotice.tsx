
import React from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const SupabaseNotice: React.FC = () => {
  const { user } = useAuth();
  const isConfigured = isSupabaseConfigured();
  
  // Only show the notice when a user is logged in but Supabase isn't configured
  if (!user || isConfigured) {
    return null;
  }
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Configuration Issue</AlertTitle>
      <AlertDescription>
        Supabase connection is not configured properly. Your data is being stored locally and won't sync with the cloud.
      </AlertDescription>
    </Alert>
  );
};

export default SupabaseNotice;

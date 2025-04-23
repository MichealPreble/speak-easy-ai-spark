
import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { getSupabaseConfigStatus, testSupabaseConnection } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export const SupabaseDebugStatus: React.FC = () => {
  const [status, setStatus] = useState(getSupabaseConfigStatus());
  const [connectionTest, setConnectionTest] = useState<{success?: boolean; message?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const runConnectionTest = async () => {
    setIsLoading(true);
    try {
      const result = await testSupabaseConnection();
      setConnectionTest(result);
    } catch (error) {
      setConnectionTest({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Run the connection test once on component mount
    runConnectionTest();
  }, []);
  
  return (
    <div className="my-4">
      <Alert variant={status.isConfigured ? "default" : "destructive"} className="mb-4">
        <AlertTitle>Supabase Configuration Status</AlertTitle>
        <AlertDescription>
          <div className="space-y-2 mt-2">
            <p>Environment Variables:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>VITE_SUPABASE_URL: {status.hasUrl ? '✅ Defined' : '❌ Missing'}</li>
              <li>VITE_SUPABASE_ANON_KEY: {status.hasKey ? '✅ Defined' : '❌ Missing'}</li>
              <li>Client Initialized: {status.clientInitialized ? '✅ Yes' : '❌ No'}</li>
            </ul>
            
            {connectionTest.success !== undefined && (
              <div className="mt-2">
                <p>Connection Test: {connectionTest.success ? '✅ Success' : '❌ Failed'}</p>
                {connectionTest.message && <p className="text-sm mt-1">{connectionTest.message}</p>}
              </div>
            )}

            <div className="mt-4">
              <Button onClick={runConnectionTest} disabled={isLoading} size="sm">
                {isLoading ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
      
      <div className="text-sm">
        <p>Next steps to resolve Supabase connection issues:</p>
        <ol className="list-decimal ml-5 space-y-1 mt-2">
          <li>Click the <strong>green Supabase button</strong> in the top-right of the Lovable interface</li>
          <li>Follow the connection process completely</li>
          <li>Verify that Email/Password authentication is enabled in your Supabase dashboard</li>
          <li>After connection, refresh the page and check this status again</li>
        </ol>
      </div>
    </div>
  );
};

export default SupabaseDebugStatus;

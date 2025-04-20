import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

interface RecentOccasionsProps {
  userId: string | null;
  onSelectRecent?: (occasion: string) => void;
}

const RecentOccasions: React.FC<RecentOccasionsProps> = ({ userId, onSelectRecent }) => {
  const [occasions, setOccasions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecentOccasions = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('practice_sessions')
          .select('occasion_name')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          throw error;
        }

        if (data) {
          // Ensure all occasion names are strings and filter out nulls
          const occasionNames = data
            .map((item: any) => (item.occasion_name ? String(item.occasion_name) : null))
            .filter(Boolean) as string[];
          
          // Get unique occasion names
          const uniqueOccasions = [...new Set(occasionNames)];
          setOccasions(uniqueOccasions);
        }
      } catch (error) {
        console.error('Error fetching recent occasions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load recent occasions.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentOccasions();
  }, [userId, toast]);

  if (isLoading) {
    return <div className="text-center py-4">Loading recent occasions...</div>;
  }

  if (occasions.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent Occasions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent practice occasions found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Recent Occasions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {occasions.map((occasion, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">
              <span>{occasion}</span>
              <Link
                to={`/practice/${encodeURIComponent(occasion)}`}
                className="text-primary hover:underline text-sm"
                onClick={() => onSelectRecent && onSelectRecent(occasion)}
              >
                Practice
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOccasions;

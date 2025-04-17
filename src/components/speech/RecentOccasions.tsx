
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { SPEECH_OCCASIONS } from '@/data/speechOccasions';
import { SpeechOccasion } from '@/types/speechOccasions';
import { useAnalytics } from '@/hooks/useAnalytics';

interface RecentOccasionsProps {
  onSelectRecent: (occasion: SpeechOccasion) => void;
}

const RecentOccasions = ({ onSelectRecent }: RecentOccasionsProps) => {
  const [recentOccasions, setRecentOccasions] = useState<string[]>([]);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const fetchRecentOccasions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('recent_occasions')
        .select('occasion_name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent occasions:', error);
        return;
      }

      if (data) {
        setRecentOccasions(data.map(item => item.occasion_name));
        trackEvent('view_recent_occasions', 'Practice', 'Recent Occasions Loaded');
      }
    };

    fetchRecentOccasions();
  }, [trackEvent]);

  const handleSelect = (name: string) => {
    const occasion = SPEECH_OCCASIONS
      .flatMap(cat => cat.occasions)
      .find(occ => occ.name === name);
      
    if (occasion) {
      onSelectRecent(occasion);
      trackEvent('select_recent', 'Practice', name);
    }
  };

  if (!recentOccasions.length) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Recently Practiced</h2>
      <div className="flex flex-wrap gap-2">
        {recentOccasions.map((name) => (
          <Button
            key={name}
            variant="outline"
            onClick={() => handleSelect(name)}
            aria-label={`Select recent occasion ${name}`}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RecentOccasions;

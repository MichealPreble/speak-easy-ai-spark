
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { SpeechOccasion } from '@/types/speechOccasions';

interface OccasionInfoProps {
  occasion: SpeechOccasion;
}

const OccasionInfo: React.FC<OccasionInfoProps> = ({ occasion }) => {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600"><strong>Occasion:</strong> {occasion.occasion}</p>
      <p className="text-sm text-gray-600"><strong>Examples:</strong> {occasion.examples}</p>
      <p className="text-sm text-gray-600"><strong>Audience Size:</strong> {occasion.audienceSize}</p>
      <p className="text-sm text-gray-600"><strong>Task:</strong> {occasion.task}</p>
    </div>
  );
};

export default OccasionInfo;

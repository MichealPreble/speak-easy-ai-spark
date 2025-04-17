
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PracticeFeedbackProps {
  practiceFeedback: number | null;
  setPracticeFeedback: (rating: number) => void;
  onSubmit: () => void;
}

const PracticeFeedback = ({
  practiceFeedback,
  setPracticeFeedback,
  onSubmit
}: PracticeFeedbackProps) => {
  return (
    <div className="mt-4">
      <p className="text-sm font-semibold">Rate your practice session:</p>
      <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer ${practiceFeedback && star <= practiceFeedback ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-400'}`}
            onClick={() => setPracticeFeedback(star)}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          />
        ))}
      </div>
      <Button
        onClick={onSubmit}
        disabled={practiceFeedback === null}
        className="mt-2"
        aria-label="Submit practice feedback"
      >
        Submit Feedback
      </Button>
    </div>
  );
};

export default PracticeFeedback;

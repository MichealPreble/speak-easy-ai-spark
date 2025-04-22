
import React from 'react';
import { Button } from '@/components/ui/button';
import { SpeechOccasion } from '@/types/speechOccasions';
import { SPEECH_OCCASIONS } from '@/data/speechOccasions';

interface FavoriteOccasionsProps {
  favorites: string[];
  onSelectFavorite: (occasion: SpeechOccasion) => void;
}

const FavoriteOccasions = ({ favorites, onSelectFavorite }: FavoriteOccasionsProps) => {
  if (!favorites.length) return null;

  const handleSelect = (title: string) => {
    // Convert the object to an array and then find the occasion
    const allOccasions: SpeechOccasion[] = Object.values(SPEECH_OCCASIONS).flat();
    const occasion = allOccasions.find(occ => occ.title === title);
      
    if (occasion) {
      onSelectFavorite(occasion);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Your Favorite Occasions</h2>
      <div className="flex flex-wrap gap-2">
        {favorites.map((title) => (
          <Button
            key={title}
            variant="outline"
            onClick={() => handleSelect(title)}
            aria-label={`Select favorite occasion ${title}`}
          >
            {title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FavoriteOccasions;

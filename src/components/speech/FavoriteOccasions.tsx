
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';

interface FavoriteOccasionsProps {
  favorites: string[];
  onSelectFavorite: (name: string) => void;
}

const FavoriteOccasions = ({ favorites, onSelectFavorite }: FavoriteOccasionsProps) => {
  if (!favorites.length) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Your Favorite Occasions</h2>
      <div className="flex flex-wrap gap-2">
        {favorites.map((name) => (
          <Button
            key={name}
            variant="outline"
            onClick={() => onSelectFavorite(name)}
            aria-label={`Select favorite occasion ${name}`}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FavoriteOccasions;

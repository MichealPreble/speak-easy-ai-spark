
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SPEECH_OCCASIONS } from '@/data/speechOccasions';
import { SpeechOccasion } from '@/types/speechOccasions';

interface SpeechOccasionSelectorProps {
  value: SpeechOccasion | null;
  onChange: (occasion: SpeechOccasion) => void;
}

const SpeechOccasionSelector = ({ value, onChange }: SpeechOccasionSelectorProps) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedOccasionId, setSelectedOccasionId] = useState<string | null>(
    value?.id || null
  );

  // Convert object to array for easier manipulation
  const occasionsArray = Object.entries(SPEECH_OCCASIONS).map(([key, value]) => ({
    category: key,
    occasions: value
  }));

  // Find the category index
  const getActiveCategoryIndex = () => {
    return occasionsArray.findIndex(category => category.category === activeTab);
  };

  // Get occasion from id
  const getOccasionById = (id: string): SpeechOccasion | undefined => {
    let occasion;
    occasionsArray.forEach(category => {
      const found = category.occasions.find(occ => occ.id === id);
      if (found) occasion = found;
    });
    return occasion;
  };

  // Select occasion handler
  const handleOccasionSelect = (id: string) => {
    const occasion = getOccasionById(id);
    if (occasion) {
      setSelectedOccasionId(id);
      onChange(occasion);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 w-full mb-4">
          {occasionsArray.map(({ category }) => (
            <TabsTrigger
              key={category}
              value={category}
              className="capitalize"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {occasionsArray.map(({ category, occasions }) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {occasions.map((occasion) => (
                <Button
                  key={occasion.id}
                  variant={selectedOccasionId === occasion.id ? "default" : "outline"}
                  className="h-auto flex flex-col items-start p-4 space-y-2"
                  onClick={() => handleOccasionSelect(occasion.id)}
                >
                  <div className="font-semibold">{occasion.title}</div>
                  <div className="text-sm text-muted-foreground text-left">
                    {occasion.description}
                  </div>
                  <div className="flex justify-between w-full text-xs mt-2">
                    <span className="capitalize">{occasion.difficulty}</span>
                    <span>{occasion.duration}</span>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SpeechOccasionSelector;

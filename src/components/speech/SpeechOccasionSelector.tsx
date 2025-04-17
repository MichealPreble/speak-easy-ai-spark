
import React, { useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { SpeechOccasion } from "@/types/speechOccasions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SPEECH_OCCASIONS } from "@/data/speechOccasions";
import { useAnalytics } from "@/hooks/useAnalytics";

interface SpeechOccasionSelectorProps {
  onSelectOccasion: (occasion: SpeechOccasion) => void;
}

const SpeechOccasionSelector: React.FC<SpeechOccasionSelectorProps> = ({ 
  onSelectOccasion 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(SPEECH_OCCASIONS[0].category);
  const { trackEvent } = useAnalytics();

  // Find the active category
  const activeCategoryIndex = SPEECH_OCCASIONS.findIndex(
    (cat) => cat.category === selectedCategory
  );

  // Filter occasions based on search term
  const filteredOccasions = searchTerm
    ? SPEECH_OCCASIONS.find((cat) => cat.category === selectedCategory)?.occasions.filter(
        (occasion) =>
          occasion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          occasion.occasion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          occasion.examples.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    : SPEECH_OCCASIONS.find((cat) => cat.category === selectedCategory)?.occasions || [];

  const handleSelectOccasion = (occasion: SpeechOccasion) => {
    onSelectOccasion(occasion);
    setIsOpen(false);
    trackEvent('select_speech_occasion', 'Practice', `Selected ${occasion.name}`);
  };

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
          trackEvent('open_occasion_selector', 'Practice', 'Opened speech occasion selector');
        }}
        className="flex items-center gap-2"
      >
        Choose Speaking Occasion
        <ChevronDown className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Select a Speaking Occasion</DialogTitle>
          </DialogHeader>
          
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search occasions (e.g., wedding, interview)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Tabs 
            defaultValue={SPEECH_OCCASIONS[0].category} 
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              setSearchTerm("");
              trackEvent('change_occasion_category', 'Practice', `Selected ${value} category`);
            }}
          >
            <TabsList className="mb-4 w-full flex overflow-x-auto">
              {SPEECH_OCCASIONS.map((category) => (
                <TabsTrigger 
                  key={category.category} 
                  value={category.category}
                  className="flex-1 min-w-max"
                >
                  {category.category}
                </TabsTrigger>
              ))}
            </TabsList>

            {SPEECH_OCCASIONS.map((category) => (
              <TabsContent key={category.category} value={category.category}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-1">
                  {filteredOccasions.length > 0 ? (
                    filteredOccasions.map((occasion) => (
                      <div
                        key={occasion.name}
                        className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => handleSelectOccasion(occasion)}
                      >
                        <h4 className="text-lg font-semibold mb-2">{occasion.name}</h4>
                        <p className="text-sm text-muted-foreground mb-1"><span className="font-medium">Occasion:</span> {occasion.occasion}</p>
                        <p className="text-sm text-muted-foreground mb-1"><span className="font-medium">Examples:</span> {occasion.examples}</p>
                        <p className="text-sm text-muted-foreground mb-1"><span className="font-medium">Audience Size:</span> {occasion.audienceSize}</p>
                        <p className="text-sm text-muted-foreground"><span className="font-medium">Task:</span> {occasion.task}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No occasions found for "{searchTerm}"</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setSearchTerm("")}
                        className="mt-2"
                      >
                        Clear search
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpeechOccasionSelector;

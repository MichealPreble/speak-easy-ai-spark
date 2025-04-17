
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SpeechOccasion } from "@/types/speechOccasions";
import SpeechOccasionSelector from "@/components/speech/SpeechOccasionSelector";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SEO from "@/components/SEO";

const PracticePage = () => {
  const [selectedOccasion, setSelectedOccasion] = useState<SpeechOccasion | null>(null);
  const { trackEvent } = useAnalytics();
  const navigate = useNavigate();

  const handleSelectOccasion = (occasion: SpeechOccasion) => {
    setSelectedOccasion(occasion);
    trackEvent('selected_occasion', 'Practice', `Selected ${occasion.name}`);
  };

  const handleStartPractice = () => {
    if (selectedOccasion) {
      trackEvent('start_practice', 'Practice', `Started practice for ${selectedOccasion.name}`);
      // Navigate to chat page with speech context
      navigate("/chat", { 
        state: { 
          practiceContext: {
            occasion: selectedOccasion.name,
            task: selectedOccasion.task
          } 
        } 
      });
    }
  };

  return (
    <>
      <SEO 
        title="Practice Public Speaking - SpeakEasyAI"
        description="Practice your public speaking skills for specific occasions with AI-powered feedback and coaching."
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Speech Practice</h1>
        <p className="text-muted-foreground mb-6">
          Select a speaking occasion to practice your speech and receive AI feedback tailored to that context.
        </p>
        
        <div className="mb-8">
          <SpeechOccasionSelector onSelectOccasion={handleSelectOccasion} />
        </div>
        
        {selectedOccasion && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Selected Occasion: {selectedOccasion.name}</CardTitle>
              <CardDescription>{selectedOccasion.occasion}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Common Examples:</h3>
                  <p className="text-muted-foreground">{selectedOccasion.examples}</p>
                </div>
                <div>
                  <h3 className="font-medium">Typical Audience Size:</h3>
                  <p className="text-muted-foreground">{selectedOccasion.audienceSize}</p>
                </div>
                <div>
                  <h3 className="font-medium">Your Task:</h3>
                  <p className="text-muted-foreground">{selectedOccasion.task}</p>
                </div>
                
                <Button 
                  onClick={handleStartPractice} 
                  className="mt-4 w-full sm:w-auto"
                  size="lg"
                >
                  Start Practicing
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!selectedOccasion && (
          <div className="p-12 border border-dashed rounded-lg flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-medium mb-2">No Occasion Selected</h2>
            <p className="text-muted-foreground mb-6">
              Choose a speaking occasion above to get tailored AI coaching for your specific situation.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default PracticePage;

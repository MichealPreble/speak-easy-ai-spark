
import React, { useState } from "react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SpeechInputComponent: React.FC = () => {
  const {
    isVoiceActive,
    toggleVoice,
    isBrowserSupported,
    recordingDuration,
  } = useVoiceRecognition(() => {});
  const [manualInput, setManualInput] = useState("");
  const [lastSubmitted, setLastSubmitted] = useState<string | null>(null);

  // Dummy analysis function placeholder
  const handleManualSubmit = () => {
    // Call your speech/text analysis logic here
    setLastSubmitted(manualInput);
    // Example: processTranscript(manualInput, duration, analysis)
  };

  if (isBrowserSupported === false) {
    return (
      <div className="my-6 max-w-md mx-auto space-y-6">
        <Alert variant="default">
          <AlertTitle>Speech Recognition Not Supported</AlertTitle>
          <AlertDescription>
            Your browser does not support speech recognition.<br />
            For the best experience, please use Chrome or Edge.
          </AlertDescription>
        </Alert>
        <div className="flex flex-col gap-4 mt-4">
          <label htmlFor="manual-textarea" className="text-sm font-medium">
            Type your speech for analysis:
          </label>
          <Textarea
            id="manual-textarea"
            placeholder="Type or paste your speech here..."
            value={manualInput}
            onChange={e => setManualInput(e.target.value)}
            rows={4}
          />
          <Button onClick={handleManualSubmit} disabled={!manualInput.trim()}>
            Submit for Analysis
          </Button>
          {lastSubmitted && (
            <div className="text-xs text-muted-foreground pt-2">
              Last submitted text: <span className="break-words">{lastSubmitted}</span>
              {/* In a real app, you'd show analysis/feedback here */}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 my-6">
      <div className="text-sm">Recording duration: {recordingDuration}s</div>
      <Button onClick={() => toggleVoice()}>
        {isVoiceActive ? "Stop Recording" : "Start Recording"}
      </Button>
    </div>
  );
};

export default SpeechInputComponent;

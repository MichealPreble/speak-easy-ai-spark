
import React from "react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const SpeechInputComponent: React.FC = () => {
  const {
    isVoiceActive,
    toggleVoice,
    isBrowserSupported,
    recordingDuration,
  } = useVoiceRecognition(() => {});

  if (isBrowserSupported === false) {
    return (
      <div className="my-6 max-w-md mx-auto">
        <Alert variant="default">
          <AlertTitle>Speech Recognition Not Supported</AlertTitle>
          <AlertDescription>
            Your browser does not support speech recognition.<br />
            For the best experience, please use Chrome or Edge.
          </AlertDescription>
        </Alert>
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

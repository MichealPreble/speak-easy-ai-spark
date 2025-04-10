
import { Mic, ArrowLeft } from "lucide-react";
import Chat from "@/components/chat/Chat";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ErrorBoundary from "@/components/ErrorBoundary";

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <header className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-bold">SpeakEasyAI</span>
            </div>
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Your Public Speaking Assistant</h1>
          <p className="text-muted-foreground mb-8">
            Practice speeches, get feedback on your delivery, or request help crafting your next presentation. 
            Use voice input for realistic practice and try the summarize feature to review your session.
          </p>
          
          <ErrorBoundary>
            <Chat />
          </ErrorBoundary>
          
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Practice Tips</h3>
            <p className="text-sm text-muted-foreground">
              Try these prompts: "Help me structure a 5-minute speech about leadership," "What are good opening lines for a technical presentation?", 
              or "Give me feedback on my speech practice" after using voice input. Use the microphone icon or press Ctrl+V to activate voice recognition.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;

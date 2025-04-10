
import { Bot, ArrowLeft } from "lucide-react";
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
              <Bot className="h-6 w-6 text-primary mr-2" />
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
          <h1 className="text-3xl font-bold mb-2">Chat with SpeakEasyAI</h1>
          <p className="text-muted-foreground mb-8">
            Experience the power of AI conversation with markdown support! Your chat history is saved in your browser. 
            Try the dark mode toggle and search feature.
          </p>
          
          <ErrorBoundary>
            <Chat />
          </ErrorBoundary>
          
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">About This Demo</h3>
            <p className="text-sm text-muted-foreground">
              This is a preview of SpeakEasyAI's conversation capabilities. Your messages now support markdown 
              formatting for **bold** and *italic* text. Use the search bar to find specific content in your 
              conversation history, and toggle between light and dark modes. Your chat history is saved locally 
              in your browser - use the "Clear Chat" button to remove it.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;

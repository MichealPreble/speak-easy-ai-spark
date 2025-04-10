
import { Bot } from "lucide-react";
import Chat from "@/components/chat/Chat";

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <header className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary mr-2" />
            <span className="text-lg font-bold">SpeakEasyAI</span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Chat with SpeakEasyAI</h1>
          <p className="text-muted-foreground mb-8">
            Experience the power of AI conversation. This is a demo version - in the full version, we'll connect to advanced language models.
          </p>
          
          <Chat />
          
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">About This Demo</h3>
            <p className="text-sm text-muted-foreground">
              This is a preview of SpeakEasyAI's conversation capabilities. In the full version, 
              you'll get more accurate and personalized responses, context-awareness, and the ability 
              to train the AI on your specific needs.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;


import { useEffect } from "react";
import Chat from "@/components/chat/Chat";
import SEO from "@/components/SEO";

const ChatPage = () => {
  return (
    <>
      <SEO 
        title="AI Chat - Practice Public Speaking"
        description="Practice your speeches with our AI assistant. Get real-time feedback on pacing, filler words, and structure to improve your public speaking skills."
        ogType="website"
      />
      <div className="container mx-auto py-8 px-4 min-h-screen flex flex-col bg-gradient-to-b from-primary-light/10 to-white dark:from-primary-dark/10 dark:to-background backdrop-blur-md">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-primary">SpeakEasyAI Chat</h1>
            <p className="text-muted-foreground backdrop-blur-sm inline-block px-4 py-2 rounded-full bg-white/50 dark:bg-black/20 border border-secondary-light/20 dark:border-secondary-dark/20">
              Practice speeches, get feedback, and improve your public speaking skills
            </p>
          </div>
          <Chat />
          <div className="mt-6 text-center text-sm text-muted-foreground p-2 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm inline-block mx-auto border border-secondary-light/20 dark:border-secondary-dark/20">
            <p>Try voice recording (mic button) or keyboard shortcuts: Ctrl+V for voice, Ctrl+S to summarize</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;

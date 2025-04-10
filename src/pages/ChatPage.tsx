
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
      <div className="container mx-auto py-8 px-4 min-h-screen flex flex-col">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">SpeakEasyAI Chat</h1>
            <p className="text-muted-foreground">
              Practice speeches, get feedback, and improve your public speaking skills
            </p>
          </div>
          <Chat />
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Try voice recording (mic button) or keyboard shortcuts: Ctrl+V for voice, Ctrl+S to summarize</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;

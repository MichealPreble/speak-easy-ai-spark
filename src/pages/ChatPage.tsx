
import { useEffect } from "react";
import Chat from "@/components/chat/Chat";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";

const ChatPage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <SEO 
        title="AI Chat - Practice Public Speaking"
        description="Practice your speeches with our AI assistant. Get real-time feedback on pacing, filler words, and structure to improve your public speaking skills."
        ogType="website"
      />
      <div className="container mx-auto py-8 px-4 min-h-screen flex flex-col bg-gradient-to-b from-primary-light/10 to-white dark:from-primary-dark/10 dark:to-background backdrop-blur-md">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-primary">SpeakEasyAI Chat</h1>
              <p className="text-muted-foreground backdrop-blur-sm inline-block px-4 py-2 rounded-full bg-white/50 dark:bg-black/20 border border-secondary-light/20 dark:border-secondary-dark/20">
                Practice speeches, get feedback, and improve your public speaking skills
              </p>
            </div>
            {user && (
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground mr-2">
                  Signed in as <span className="font-medium">{user.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="glass-button"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </Button>
              </div>
            )}
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

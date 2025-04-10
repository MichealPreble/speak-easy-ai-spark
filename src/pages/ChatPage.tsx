
import { useEffect, useState } from "react";
import Chat from "@/components/chat/Chat";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";

const scenarios = [
  { value: "small-team", label: "Present to a Small Team" },
  { value: "conference-keynote", label: "Deliver a Conference Keynote" },
  { value: "wedding-toast", label: "Give a Wedding Toast" }
];

const ChatPage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

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
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-medium mr-4">Practice Scenario:</h2>
              <Select value={selectedScenario || ""} onValueChange={setSelectedScenario}>
                <SelectTrigger className="w-[250px] bg-white/50 dark:bg-black/20 border-secondary-light/20 dark:border-secondary-dark/20">
                  <SelectValue placeholder="Select a scenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No scenario</SelectItem>
                  {scenarios.map((scenario) => (
                    <SelectItem key={scenario.value} value={scenario.value}>
                      {scenario.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedScenario && (
              <div className="text-sm text-muted-foreground bg-white/50 dark:bg-black/20 p-3 rounded-md border border-secondary-light/20 dark:border-secondary-dark/20">
                <p className="font-medium mb-1">Selected scenario: {scenarios.find(s => s.value === selectedScenario)?.label}</p>
                <p>Type "start practice" to begin your guided practice session!</p>
              </div>
            )}
          </div>
          
          <Chat selectedScenario={selectedScenario} />
          <div className="mt-6 text-center text-sm text-muted-foreground p-2 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm inline-block mx-auto border border-secondary-light/20 dark:border-secondary-dark/20">
            <p>Try voice recording (mic button) or keyboard shortcuts: Ctrl+V for voice, Ctrl+S to summarize</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;

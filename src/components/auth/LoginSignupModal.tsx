
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

interface LoginSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
}

export const LoginSignupModal: React.FC<LoginSignupModalProps> = ({
  isOpen,
  onClose,
  defaultTab = "signin"
}) => {
  const [activeTab, setActiveTab] = React.useState<"signin" | "signup">(defaultTab);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-[90vw] p-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl font-semibold text-center">
            {activeTab === "signin" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue={defaultTab}
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "signin" | "signup")}
          className="w-full mt-4"
        >
          <TabsList className="grid w-full grid-cols-2 h-14 rounded-none bg-muted/50">
            <TabsTrigger
              value="signin"
              className="rounded-none data-[state=active]:bg-background"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-none data-[state=active]:bg-background"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          <div className="p-6">
            <TabsContent value="signin" className="mt-0">
              <SignIn setActiveTab={(tab) => setActiveTab(tab as "signin" | "signup")} />
            </TabsContent>
            <TabsContent value="signup" className="mt-0">
              <SignUp setActiveTab={(tab) => setActiveTab(tab as "signin" | "signup")} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginSignupModal;

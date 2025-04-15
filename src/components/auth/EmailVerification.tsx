
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function EmailVerification() {
  const { user, isEmailVerified, sendVerificationEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isEmailVerified) {
      toast({
        title: "Email verified",
        description: "Your email has been successfully verified.",
      });
      navigate("/");
    }
  }, [isEmailVerified, navigate, toast]);

  const handleResendEmail = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    try {
      await sendVerificationEmail();
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((current) => {
          if (current <= 1) {
            clearInterval(timer);
            return 0;
          }
          return current - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-white dark:from-primary-dark/10 dark:to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-panel">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">
              Email Verification
            </CardTitle>
            <CardDescription className="text-center">
              You need to be logged in to verify your email
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => navigate("/auth")} 
              className="mt-4"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-white dark:from-primary-dark/10 dark:to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-panel">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-center">
            We've sent a verification email to {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Please check your email and click on the verification link to confirm your account.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            If you don't see the email, check your spam folder.
          </p>
          
          <Button 
            onClick={handleResendEmail} 
            variant="outline" 
            disabled={isLoading || countdown > 0}
            className="mt-2"
          >
            {isLoading 
              ? "Sending..." 
              : countdown > 0 
                ? `Resend in ${countdown}s` 
                : "Resend verification email"}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate("/auth")}>
            Back to Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

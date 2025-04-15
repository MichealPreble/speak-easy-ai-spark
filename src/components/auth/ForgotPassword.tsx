
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await resetPassword(values.email);
      setIsSubmitted(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-white dark:from-primary-dark/10 dark:to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-panel">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            {!isSubmitted 
              ? "Enter your email address and we'll send you a link to reset your password" 
              : "Check your email for a link to reset your password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            placeholder="your.email@example.com" 
                            {...field} 
                            className="glass-card pl-10" 
                            type="email"
                            autoComplete="email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full glass-button"
                  disabled={isLoading}
                  data-testid="submit-button"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center py-4" aria-live="polite">
              <p className="mb-4">We've sent a password reset link to your email.</p>
              <p className="text-sm text-muted-foreground">
                Didn't receive an email? Check your spam folder or{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setIsSubmitted(false)}
                >
                  try again
                </Button>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" asChild>
            <Link to="/auth">Back to Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


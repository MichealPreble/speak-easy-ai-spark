
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").optional(),
  avatar_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export default function UserProfile() {
  const { user, isEmailVerified, updateProfile, sendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      avatar_url: "",
    },
  });

  useEffect(() => {
    if (user) {
      // Extract user metadata
      const metadata = user.user_metadata || {};
      
      form.reset({
        full_name: metadata.full_name || "",
        avatar_url: metadata.avatar_url || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Only include fields that have values
      const updates: { full_name?: string; avatar_url?: string } = {};
      if (values.full_name) updates.full_name = values.full_name;
      if (values.avatar_url) updates.avatar_url = values.avatar_url;
      
      await updateProfile(updates);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    setIsSendingVerification(true);
    try {
      await sendVerificationEmail();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification email",
        variant: "destructive",
      });
    } finally {
      setIsSendingVerification(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              You need to be logged in to view your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-xl py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={user.user_metadata?.avatar_url || ''} 
                alt={user.user_metadata?.full_name || user.email || 'User'} 
              />
              <AvatarFallback>
                {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle>{user.user_metadata?.full_name || 'User'}</CardTitle>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {isEmailVerified ? (
                  <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50 dark:bg-green-950/20">Verified</Badge>
                ) : (
                  <Badge variant="outline" className="text-yellow-500 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">Unverified</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isEmailVerified && (
            <div className="mb-6 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
                Your email address is not verified. Please verify your email to access all features.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSendVerificationEmail}
                disabled={isSendingVerification}
              >
                {isSendingVerification ? "Sending..." : "Send verification email"}
              </Button>
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="avatar_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/avatar.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="mr-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  asChild
                >
                  <Link to="/auth/update-password">Change Password</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import PasswordField from "./PasswordField";
import EmailField from "./EmailField";
import RememberMeCheckbox from "./RememberMeCheckbox";
import ForgotPasswordLink from "./ForgotPasswordLink";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SignInFormProps {
  setActiveTab: (tab: string) => void;
}

const SignInForm = ({ setActiveTab }: SignInFormProps) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await signIn(values.email, values.password, values.rememberMe);
      toast({
        title: "Success",
        description: "You have been signed in",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <EmailField control={form.control} disabled={isLoading} />

        <PasswordField
          control={form.control}
          name="password"
          label="Password"
          disabled={isLoading}
        />

        <div className="flex items-center justify-between">
          <RememberMeCheckbox control={form.control} disabled={isLoading} />
          <ForgotPasswordLink />
        </div>

        <Button
          type="submit"
          className="w-full glass-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <button
          type="button"
          onClick={() => setActiveTab("signup")}
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </button>
      </div>
    </Form>
  );
};

export default SignInForm;

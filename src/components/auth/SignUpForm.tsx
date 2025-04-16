
import React, { useState } from "react";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import PasswordField from './PasswordField';
import EmailField from './EmailField';
import NameField from './NameField';
import TermsCheckbox from './TermsCheckbox';
import { useToast } from '@/hooks/use-toast';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'You must agree to the terms' }) }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignUpFormProps {
  onSwitchTab: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchTab }) => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false as any, // Use type assertion to avoid type error during initialization
    },
  });

  const handleSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      await signUp(values.email, values.password, values.name);
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <NameField control={form.control} disabled={isLoading} />
        
        <EmailField control={form.control} disabled={isLoading} />
        
        <PasswordField
          control={form.control}
          name="password"
          label="Password"
          placeholder="Create a password"
          showStrengthIndicator={true}
          disabled={isLoading}
        />
        
        <PasswordField
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          confirmField={true}
          disabled={isLoading}
        />
        
        <TermsCheckbox control={form.control} disabled={isLoading} />
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing up...
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
        
        <div className="text-center text-sm">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchTab}
            className="text-primary hover:underline"
            disabled={isLoading}
          >
            Sign in
          </button>
        </div>
      </form>
    </Form>
  );
};

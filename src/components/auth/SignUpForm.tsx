
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const calculateStrength = (pwd: string): number => {
    let strength = 0;
    if (!pwd) return strength;
    
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    
    return strength;
  };

  const strength = calculateStrength(password);
  
  let strengthText = '';
  let progressClass = '';
  
  if (strength === 0) return null;
  
  if (strength === 4) {
    strengthText = 'Strong';
    progressClass = 'bg-green-500';
  } else if (strength === 3) {
    strengthText = 'Moderate';
    progressClass = 'bg-yellow-500';
  } else {
    strengthText = 'Weak';
    progressClass = 'bg-red-500';
  }

  return (
    <div className="mt-2">
      <div className="h-1 w-full bg-gray-200 rounded-full">
        <div 
          className={`h-1 rounded-full ${progressClass}`}
          style={{ width: `${strength * 25}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">Password strength: {strengthText}</p>
    </div>
  );
};

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

interface SignUpFormProps {
  onSwitchTab: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchTab }) => {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    try {
      signupSchema.parse({
        name,
        email,
        password,
        confirmPassword,
        acceptTerms: termsAccepted,
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await signUp({
        name,
        email,
        password
      });
      // Success can be handled here if needed
    } catch (error) {
      console.error('Signup error:', error);
      // Handle specific errors here if needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          disabled={isLoading}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          disabled={isLoading}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            disabled={isLoading}
            aria-invalid={!!errors.password}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label="Show password"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        {password && <PasswordStrength password={password} />}
      </div>
      
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            disabled={isLoading}
            aria-invalid={!!errors.confirmPassword}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex={-1}
            aria-label="Show confirm password"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>
      
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-1"
          disabled={isLoading}
        />
        <label 
          htmlFor="terms" 
          className="text-sm font-medium leading-none"
        >
          I agree to the Terms and Conditions
        </label>
      </div>
      {errors.acceptTerms && <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>}
      
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
  );
};

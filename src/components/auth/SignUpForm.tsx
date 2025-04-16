
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { PasswordField } from './PasswordField';
import { TermsCheckbox } from './TermsCheckbox';
import { Loader2 } from 'lucide-react';

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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match';
    
    if (!termsAccepted) newErrors.terms = 'You must agree to the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      
      <PasswordField
        id="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a password"
        error={errors.password}
        disabled={isLoading}
      />
      {password && <PasswordStrength password={password} />}
      
      <PasswordField
        id="confirmPassword"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your password"
        error={errors.confirmPassword}
        disabled={isLoading}
      />
      
      <TermsCheckbox
        checked={termsAccepted}
        onCheckedChange={setTermsAccepted}
        error={errors.terms}
        disabled={isLoading}
      />
      
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

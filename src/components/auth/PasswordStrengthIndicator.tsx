
import React from "react";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

const PasswordStrengthIndicator = ({ password, className }: PasswordStrengthIndicatorProps) => {
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;
    
    let strength = 0;
    
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 30) return "bg-red-500";
    if (strength < 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 30) return "Weak";
    if (strength < 60) return "Medium";
    return "Strong";
  };

  const passwordStrength = calculatePasswordStrength(password);

  if (!password) return null;

  return (
    <div className={`mt-2 ${className}`}>
      <Progress 
        value={passwordStrength} 
        className={getPasswordStrengthColor(passwordStrength)} 
      />
      <p className="text-xs text-muted-foreground mt-1">
        Password strength: {getPasswordStrengthText(passwordStrength)}
      </p>
    </div>
  );
};

export default PasswordStrengthIndicator;

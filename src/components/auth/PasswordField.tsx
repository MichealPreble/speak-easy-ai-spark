
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

interface PasswordFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  showStrengthIndicator?: boolean;
  disabled?: boolean;
  confirmField?: boolean;
}

const PasswordField = ({
  control,
  name,
  label,
  placeholder = "••••••••",
  showStrengthIndicator = false,
  disabled = false,
  confirmField = false,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                {...field}
                className="glass-card pr-10"
                disabled={disabled}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={confirmField ? "Show confirm password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormControl>
          {showStrengthIndicator && <PasswordStrengthIndicator password={field.value} />}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordField;

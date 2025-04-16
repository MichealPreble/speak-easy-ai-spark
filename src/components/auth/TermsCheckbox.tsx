
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";

interface TermsCheckboxProps {
  control: Control<any>;
  disabled?: boolean;
}

const TermsCheckbox = ({ control, disabled = false }: TermsCheckboxProps) => {
  return (
    <FormField
      control={control}
      name="acceptTerms"
      render={({ field }) => (
        <div className="flex items-start space-x-2 mt-4">
          <Checkbox
            id="acceptTerms"
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="acceptTerms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I accept the{" "}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </label>
            <FormMessage />
          </div>
        </div>
      )}
    />
  );
};

export default TermsCheckbox;

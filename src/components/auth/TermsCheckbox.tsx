
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface TermsCheckboxProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  disabled?: boolean;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  register,
  errors,
  disabled = false,
}) => {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        id="acceptTerms"
        {...register('acceptTerms', {
          required: 'You must agree to the terms'
        })}
        disabled={disabled}
      />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor="acceptTerms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the{" "}
          <a href="/terms" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            Terms and Conditions
          </a>
        </Label>
        {errors.acceptTerms && (
          <p className="text-destructive text-sm">
            {errors.acceptTerms.message as string}
          </p>
        )}
      </div>
    </div>
  );
};

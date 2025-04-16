
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";

interface RememberMeCheckboxProps {
  control: Control<any>;
  disabled?: boolean;
}

const RememberMeCheckbox = ({ control, disabled = false }: RememberMeCheckboxProps) => {
  return (
    <FormField
      control={control}
      name="rememberMe"
      render={({ field }) => (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
          <label
            htmlFor="rememberMe"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
          <FormMessage />
        </div>
      )}
    />
  );
};

export default RememberMeCheckbox;

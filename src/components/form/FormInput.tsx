"use client";

import {
  ChangeEventHandler,
  FocusEventHandler,
  forwardRef,
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
} from "react";
import { useFormStatus } from "react-dom";
import FormErrors from "@/src/components/form/FromErrors";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";

// Interface for the props expected by FormInput component
interface FormInputProps {
  id: string;
  type?: HTMLInputTypeAttribute;
  label?: string;
  value?: string | number | readonly string[] | undefined;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  errors?: Record<string, string[] | undefined>;
  required?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  className?: string;
  placeHolder?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  defaultValue?: string | number | readonly string[];
}

// FormInput component definition using forwardRef
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      type,
      value,
      label,
      onBlur,
      errors,
      required,
      disabled,
      onChange,
      className,
      placeHolder,
      autoComplete,
      defaultValue,
    },
    ref, // Forwarded ref for the input element
  ) => {
    const { pending } = useFormStatus(); // Destructuring pending status from useFormStatus

    return (
      <div className={"space-y-2"}>
        <div className={"space-y-1"}>
          {label && (
            <Label
              htmlFor={id}
              className={
                "text-xs font-bold text-zinc-500 dark:text-secondary/70"
              }
            >
              {label}
            </Label>
          )}
          <Input
            id={id}
            name={id}
            ref={ref}
            type={type}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            disabled={pending || disabled} // Disable input if form is pending or disabled
            required={required}
            placeholder={placeHolder}
            autoComplete={autoComplete}
            defaultValue={defaultValue}
            className={cn("px-2 py-1", className)}
            aria-describedby={`${id}-error`}
          />
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    );
  },
);

// Setting the display name for the FormInput component
FormInput.displayName = "FormInput";

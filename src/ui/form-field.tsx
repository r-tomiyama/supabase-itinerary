import * as React from "react";
import { Label } from "./label";
import { cn } from "@libs/utils";

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, htmlFor, required, error, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {children}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export { FormField };

import * as React from "react";

import { cn } from "@libs/utils";

import { Label } from "./label";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, htmlFor, required, error, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </Label>
        {children}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);
FormField.displayName = "FormField";

export { FormField };

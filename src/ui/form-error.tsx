import * as React from "react";
import { cn } from "@libs/utils";

interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string | null;
}

const FormError = React.forwardRef<HTMLDivElement, FormErrorProps>(
  ({ className, error, children, ...props }, ref) => {
    if (!error && !children) return null;
    
    return (
      <div
        ref={ref}
        className={cn(
          "bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6",
          className
        )}
        {...props}
      >
        {error || children}
      </div>
    );
  }
);
FormError.displayName = "FormError";

export { FormError };

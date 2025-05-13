import * as React from "react";

import { cn } from "@libs/utils";

type FormErrorProps = {
  error?: string | null;
} & React.HTMLAttributes<HTMLDivElement>;

const FormError = React.forwardRef<HTMLDivElement, FormErrorProps>(
  ({ className, error, children, ...props }, ref) => {
    if (!error && !children) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-700",
          className,
        )}
        {...props}
      >
        {error ?? children}
      </div>
    );
  },
);
FormError.displayName = "FormError";

export { FormError };

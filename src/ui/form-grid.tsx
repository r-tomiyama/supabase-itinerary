import * as React from "react";
import { cn } from "@libs/utils";

interface FormGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
}

const FormGrid = React.forwardRef<HTMLDivElement, FormGridProps>(
  ({ className, columns = 1, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-4",
          columns === 1 ? "grid-cols-1" : `grid-cols-1 md:grid-cols-${columns}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FormGrid.displayName = "FormGrid";

export { FormGrid };

import * as React from "react";

import { cn } from "@libs/utils";

type FormGridProps = {
  columns?: number;
} & React.HTMLAttributes<HTMLDivElement>;

const FormGrid = React.forwardRef<HTMLDivElement, FormGridProps>(
  ({ className, columns = 1, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-4",
          columns === 1
            ? "grid-cols-1"
            : `grid-cols-1 md:grid-cols-${columns.toString()}`,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
FormGrid.displayName = "FormGrid";

export { FormGrid };

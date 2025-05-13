import * as React from "react";

import { cn } from "@libs/utils";

type FormActionsProps = {} & React.HTMLAttributes<HTMLDivElement>;

const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex justify-end gap-2 pt-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
FormActions.displayName = "FormActions";

export { FormActions };

import cn from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size = "md", className, ...props }, ref) => {
    return (
      <Loader2
        ref={ref}
        className={cn("animate-spin shrink-0", sizeClasses[size], className)}
        {...props}
      />
    );
  },
);

Spinner.displayName = "Spinner";

export default Spinner;

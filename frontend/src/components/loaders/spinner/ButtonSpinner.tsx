import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import React from "react";

export interface ButtonSpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: "sm" | "md";
}

export function ButtonSpinner({
  size = "sm",
  className,
  ...props
}: ButtonSpinnerProps) {
  return (
    <Spinner
      size={size}
      className={cn("mr-1.5 shrink-0", className)}
      {...props}
    />
  );
}

export default ButtonSpinner;

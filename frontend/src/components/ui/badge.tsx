import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import cn from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.08em] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#EEF2FF] text-[#4F46E5]",
        secondary: "border-[#E5E7EB] bg-white text-[#0F172A]",
        success: "border-transparent bg-emerald-50 text-[#22C55E]",
        warning: "border-transparent bg-amber-50 text-amber-700",
        destructive: "border-transparent bg-red-50 text-[#DC2626]",
        outline: "border-[#E5E7EB] text-[#0F172A]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

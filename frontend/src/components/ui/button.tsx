import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import cn from "@/lib/utils";

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'bg-[#6366F1] text-white hover:bg-[#4F46E5] shadow-none',
        destructive: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-none',
        outline: 'border border-[#E5E7EB] bg-white text-[#0F172A] hover:bg-slate-50 shadow-none',
        secondary: 'border border-[#E5E7EB] bg-white text-[#0F172A] hover:bg-slate-50 shadow-none',
        ghost: 'hover:bg-indigo-50/50 hover:text-[#4F46E5] text-[#0F172A]',
        link: 'text-[#4F46E5] underline-offset-4 hover:underline p-0 h-auto font-normal',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-11 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };


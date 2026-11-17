"use client";

import cn from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";
import { pauseToastTimer, resumeToastTimer } from "@/hooks/use-toast";

const ToastContext = React.createContext<{
  onClose?: () => void;
}>({});

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const ToastViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    role="region"
    aria-label="Notifications"
    className={cn(
      "fixed bottom-4 right-4 z-[9999] flex max-h-screen w-full flex-col-reverse gap-2.5 p-4 pointer-events-none sm:bottom-6 sm:right-6 md:max-w-[420px]",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
ToastViewport.displayName = "ToastViewport";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start justify-between space-x-3 overflow-hidden rounded-xl border p-4 shadow-lg transition-all duration-300 ease-out select-none",
  {
    variants: {
      variant: {
        default: "border-slate-200 bg-white text-slate-900 shadow-slate-200/50",
        destructive: "destructive group border-red-200 bg-red-50/95 text-red-900 shadow-red-100/50",
        success: "success group border-emerald-200 bg-emerald-50/95 text-emerald-900 shadow-emerald-100/50",
        warning: "warning group border-amber-200 bg-amber-50/95 text-amber-900 shadow-amber-100/50",
        info: "info group border-blue-200 bg-blue-50/95 text-blue-900 shadow-blue-100/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToastProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof toastVariants> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
  id?: string;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      variant,
      open = true,
      onOpenChange,
      duration,
      id,
      children,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const handleClose = React.useCallback(() => {
      onOpenChange?.(false);
    }, [onOpenChange]);

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (id) {
        pauseToastTimer(id);
      }
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (id) {
        resumeToastTimer(id);
      }
      onMouseLeave?.(e);
    };

    return (
      <ToastContext.Provider value={{ onClose: handleClose }}>
        <div
          ref={ref}
          role="status"
          aria-live="polite"
          data-state={open ? "open" : "closed"}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            toastVariants({ variant }),
            open
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-3 scale-95 pointer-events-none",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ToastContext.Provider>
    );
  }
);
Toast.displayName = "Toast";

export type ToastActionElement = React.ReactElement;

const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-transparent px-3 text-xs font-medium transition-colors hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-red-200 group-[.destructive]:hover:border-red-300 group-[.destructive]:hover:bg-red-100 group-[.destructive]:hover:text-red-900 group-[.destructive]:focus:ring-red-400",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const { onClose } = React.useContext(ToastContext);

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Close notification"
      className={cn(
        "rounded-md p-1 text-slate-400 transition-colors hover:text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 group-[.destructive]:text-red-400 group-[.destructive]:hover:text-red-700 group-[.success]:text-emerald-500 group-[.success]:hover:text-emerald-800 group-[.warning]:text-amber-500 group-[.warning]:hover:text-amber-800 group-[.info]:text-blue-500 group-[.info]:hover:text-blue-800 cursor-pointer",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        onClose?.();
      }}
      {...props}
    >
      <X className="h-4 w-4" />
    </button>
  );
});
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("text-sm font-semibold tracking-tight text-[#0F172A] leading-snug", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-xs leading-relaxed text-slate-600 group-[.destructive]:text-red-700 group-[.success]:text-emerald-700 group-[.warning]:text-amber-700 group-[.info]:text-blue-700",
      className
    )}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toastVariants,
};

export { toast, pauseToastTimer, resumeToastTimer, DEFAULT_TOAST_DURATIONS } from "@/hooks/use-toast";
export type { ToastOptions, ToastVariant } from "@/hooks/use-toast";

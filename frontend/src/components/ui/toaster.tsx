"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import cn from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import * as React from "react";

export interface ToasterProps {
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center"
    | (string & {});
  closeButton?: boolean;
  richColors?: boolean;
  className?: string;
}

export function Toaster({
  position = "bottom-right",
  className,
}: ToasterProps) {
  const { toasts } = useToast();

  const getPositionClasses = (pos: string) => {
    switch (pos) {
      case "top-left":
        return "top-4 left-4 sm:top-6 sm:left-6 flex-col";
      case "bottom-left":
        return "bottom-4 left-4 sm:bottom-6 sm:left-6 flex-col-reverse";
      case "top-right":
        return "top-4 right-4 sm:top-6 sm:right-6 flex-col";
      case "top-center":
        return "top-4 left-1/2 -translate-x-1/2 sm:top-6 flex-col";
      case "bottom-center":
        return "bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6 flex-col-reverse";
      case "bottom-right":
      default:
        return "bottom-4 right-4 sm:bottom-6 sm:right-6 flex-col-reverse";
    }
  };

  return (
    <ToastProvider>
      <ToastViewport className={cn(getPositionClasses(position), className)}>
        {toasts.map(({ id, title, description, action, variant, ...props }) => (
          <Toast key={id} id={id} variant={variant} {...props}>
            <div className="flex items-start gap-3 w-full pr-5">
              {variant === "success" && (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {variant === "destructive" && (
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              )}
              {variant === "warning" && (
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              {variant === "info" && (
                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              )}
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
              {action}
            </div>
            <ToastClose />
          </Toast>
        ))}
      </ToastViewport>
    </ToastProvider>
  );
}

export default Toaster;

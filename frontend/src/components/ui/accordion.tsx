"use client";

import cn from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import * as React from "react";

interface AccordionContextValue {
  value: string | string[];
  onItemToggle: (itemValue: string) => void;
  isItemOpen: (itemValue: string) => boolean;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an <Accordion />");
  }
  return context;
}

interface AccordionSingleProps {
  type: "single";
  collapsible?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface AccordionMultipleProps {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  children: React.ReactNode;
  className?: string;
}

export type AccordionProps = (AccordionSingleProps | AccordionMultipleProps) & {
  className?: string;
};

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (props, ref) => {
    const { className, children, ...rest } = props;

    // Single mode state
    const [singleValue, setSingleValue] = React.useState<string>(
      rest.type === "single" ? rest.value ?? rest.defaultValue ?? "" : "",
    );

    // Multiple mode state
    const [multipleValue, setMultipleValue] = React.useState<string[]>(
      rest.type === "multiple"
        ? rest.value ?? rest.defaultValue ?? []
        : [],
    );

    const isControlled = rest.value !== undefined;

    const currentSingle = isControlled && rest.type === "single"
      ? (rest.value as string)
      : singleValue;

    const currentMultiple = isControlled && rest.type === "multiple"
      ? (rest.value as string[])
      : multipleValue;

    const onItemToggle = React.useCallback(
      (itemValue: string) => {
        if (rest.type === "single") {
          const next =
            currentSingle === itemValue
              ? rest.collapsible
                ? ""
                : currentSingle
              : itemValue;

          if (!isControlled) {
            setSingleValue(next);
          }
          rest.onValueChange?.(next);
        } else {
          const exists = currentMultiple.includes(itemValue);
          const next = exists
            ? currentMultiple.filter((v) => v !== itemValue)
            : [...currentMultiple, itemValue];

          if (!isControlled) {
            setMultipleValue(next);
          }
          rest.onValueChange?.(next);
        }
      },
      [rest, isControlled, currentSingle, currentMultiple],
    );

    const isItemOpen = React.useCallback(
      (itemValue: string) => {
        if (rest.type === "single") {
          return currentSingle === itemValue;
        }
        return currentMultiple.includes(itemValue);
      },
      [rest.type, currentSingle, currentMultiple],
    );

    const contextValue = React.useMemo(
      () => ({
        value: rest.type === "single" ? currentSingle : currentMultiple,
        onItemToggle,
        isItemOpen,
      }),
      [rest.type, currentSingle, currentMultiple, onItemToggle, isItemOpen],
    );

    return (
      <AccordionContext.Provider value={contextValue}>
        <div ref={ref} className={cn("space-y-4", className)}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = "Accordion";

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
}

const AccordionItemContext =
  React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItem() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      "AccordionItem subcomponents must be used within an <AccordionItem />",
    );
  }
  return context;
}

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const { isItemOpen } = useAccordion();
    const isOpen = isItemOpen(value);

    const itemContext = React.useMemo(
      () => ({ value, isOpen }),
      [value, isOpen],
    );

    return (
      <AccordionItemContext.Provider value={itemContext}>
        <div
          ref={ref}
          data-state={isOpen ? "open" : "closed"}
          className={cn(
            "rounded-2xl border bg-white transition-all duration-200",
            isOpen
              ? "border-[#4F46E5] shadow-none"
              : "border-[#E5E7EB] hover:border-slate-300 shadow-none",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);
AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => {
  const { onItemToggle } = useAccordion();
  const { value, isOpen } = useAccordionItem();

  return (
    <button
      ref={ref}
      type="button"
      data-state={isOpen ? "open" : "closed"}
      aria-expanded={isOpen}
      onClick={() => onItemToggle(value)}
      className={cn(
        "flex w-full items-center justify-between p-5 sm:p-6 text-left font-bold text-[#0F172A] transition-all cursor-pointer",
        className,
      )}
      {...props}
    >
      <span className="flex-1 pr-4">{children}</span>
      <ChevronDown
        className={cn(
          "h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200",
          isOpen && "rotate-180 text-[#4F46E5]",
        )}
      />
    </button>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, children, ...props }, ref) => {
  const { isOpen } = useAccordionItem();

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      data-state={isOpen ? "open" : "closed"}
      role="region"
      className={cn(
        "px-5 pb-6 pt-0 sm:px-6 sm:pb-7 animate-in fade-in-50 duration-200",
        className,
      )}
      {...props}
    >
      <div className="border-t border-slate-100 pt-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
        {children}
      </div>
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
};

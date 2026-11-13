"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";
import * as ReactDOM from "react-dom";

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  getLabel: (val: string) => React.ReactNode;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelect() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a <Select /> provider");
  }
  return context;
}

// Helper to recursively traverse React children and extract item value -> label mapping
function extractItems(
  children: React.ReactNode,
  map: Map<string, React.ReactNode>
) {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const props = child.props as { value?: string; children?: React.ReactNode };
    if (props && typeof props.value === "string") {
      map.set(props.value, props.children);
    }
    if (props && props.children) {
      extractItems(props.children, map);
    }
  });
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  children?: React.ReactNode;
}

export function Select({
  value: valueProp,
  defaultValue = "",
  onValueChange: onValueChangeProp,
  open: openProp,
  defaultOpen = false,
  onOpenChange: onOpenChangeProp,
  disabled = false,
  name,
  required,
  children,
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlledValue = valueProp !== undefined;
  const currentValue = isControlledValue ? (valueProp ?? "") : uncontrolledValue;

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlledOpen = openProp !== undefined;
  const currentOpen = isControlledOpen ? !!openProp : uncontrolledOpen;

  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const handleOpenChange = React.useCallback(
    (updater: React.SetStateAction<boolean>) => {
      const nextOpen =
        typeof updater === "function" ? updater(currentOpen) : updater;
      if (!isControlledOpen) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChangeProp?.(nextOpen);
    },
    [currentOpen, isControlledOpen, onOpenChangeProp]
  );

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlledValue) {
        setUncontrolledValue(newValue);
      }
      onValueChangeProp?.(newValue);
    },
    [isControlledValue, onValueChangeProp]
  );

  // Cache items mapping from children
  const itemsMap = React.useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    extractItems(children, map);
    return map;
  }, [children]);

  const getLabel = React.useCallback(
    (val: string) => itemsMap.get(val),
    [itemsMap]
  );

  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      value: currentValue,
      onValueChange: handleValueChange,
      open: currentOpen,
      setOpen: handleOpenChange,
      disabled,
      name,
      required,
      triggerRef,
      contentRef,
      getLabel,
    }),
    [
      currentValue,
      handleValueChange,
      currentOpen,
      handleOpenChange,
      disabled,
      name,
      required,
      getLabel,
    ]
  );

  return (
    <SelectContext.Provider value={contextValue}>
      {children}
    </SelectContext.Provider>
  );
}

export interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="group" className={cn("p-1", className)} {...props} />
  )
);
SelectGroup.displayName = "SelectGroup";

export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder, children, ...props }, ref) => {
    const { value, getLabel } = useSelect();
    const resolvedLabel = value !== "" ? getLabel(value) : undefined;
    const displayText = resolvedLabel ?? children;

    return (
      <span
        ref={ref}
        className={cn(
          "block truncate text-left",
          !displayText && "text-slate-400 font-normal",
          className
        )}
        {...props}
      >
        {displayText || placeholder || ""}
      </span>
    );
  }
);
SelectValue.displayName = "SelectValue";

export interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
>(({ className, children, disabled, ...props }, ref) => {
  const { open, setOpen, disabled: contextDisabled, triggerRef, name, value, required } =
    useSelect();
  const isDisabled = disabled || contextDisabled;

  return (
    <button
      ref={(node) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      disabled={isDisabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDisabled) {
          setOpen((prev) => !prev);
        }
      }}
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition-colors placeholder:text-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent",
        "hover:border-slate-300",
        "disabled:cursor-not-allowed disabled:opacity-50",
        open && "border-blue-600 ring-2 ring-blue-600/20",
        className
      )}
      {...props}
    >
      <div className="flex-1 truncate text-left">{children}</div>
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ml-2",
          open && "rotate-180 text-blue-600"
        )}
      />
      {name && (
        <input
          type="hidden"
          name={name}
          value={value}
          required={required}
        />
      )}
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

export interface SelectContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  position?: "popper" | "item-aligned";
  side?: "top" | "bottom";
  sideOffset?: number;
  align?: "start" | "center" | "end";
}

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  SelectContentProps
>(
  (
    {
      className,
      children,
      position = "popper",
      side = "bottom",
      sideOffset = 4,
      align = "start",
      style,
      ...props
    },
    ref
  ) => {
    const { open, setOpen, contentRef, triggerRef } = useSelect();
    const [mounted, setMounted] = React.useState(false);
    const [posStyle, setPosStyle] = React.useState<React.CSSProperties>({});

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const updatePosition = React.useCallback(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Determine side: strictly prefer bottom unless space below is genuinely insufficient
      const preferredSide = side;
      let actualSide: "top" | "bottom" = preferredSide;

      if (preferredSide === "bottom") {
        if (spaceBelow < 130 && spaceAbove > spaceBelow) {
          actualSide = "top";
        }
      } else {
        if (spaceAbove < 130 && spaceBelow > spaceAbove) {
          actualSide = "bottom";
        }
      }

      // Horizontal calculation based on align
      const triggerWidth = rect.width;
      const minW = Math.max(triggerWidth, 140);
      let left = rect.left;

      if (align === "end") {
        left = rect.right - minW;
      } else if (align === "center") {
        left = rect.left + triggerWidth / 2 - minW / 2;
      }

      // Prevent horizontal overflow
      if (left + minW > window.innerWidth - 8) {
        left = Math.max(8, window.innerWidth - minW - 8);
      }
      if (left < 8) {
        left = 8;
      }

      const newStyle: React.CSSProperties = {
        position: "fixed",
        left: `${Math.round(left)}px`,
        minWidth: `${Math.round(minW)}px`,
        width: position === "popper" ? `${Math.round(Math.max(triggerWidth, minW))}px` : undefined,
        maxWidth: "calc(100vw - 16px)",
        zIndex: 9999,
      };

      if (actualSide === "bottom") {
        // Anchored directly below the trigger
        newStyle.top = `${Math.round(rect.bottom + sideOffset)}px`;
        newStyle.bottom = "auto";
        newStyle.maxHeight = `${Math.max(100, Math.min(280, Math.floor(spaceBelow - 12)))}px`;
      } else {
        // Anchored directly above the trigger: bottom pinned to trigger's top
        newStyle.bottom = `${Math.round(window.innerHeight - rect.top + sideOffset)}px`;
        newStyle.top = "auto";
        newStyle.maxHeight = `${Math.max(100, Math.min(280, Math.floor(spaceAbove - 12)))}px`;
      }

      setPosStyle(newStyle);
    }, [triggerRef, side, sideOffset, align, position]);

    React.useEffect(() => {
      if (!open) return;
      updatePosition();

      const handleResize = () => updatePosition();
      const handleScroll = (e: Event) => {
        if (contentRef.current && contentRef.current.contains(e.target as Node)) {
          return;
        }
        if (triggerRef.current) {
          const rect = triggerRef.current.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) {
            setOpen(false);
            return;
          }
        }
        updatePosition();
      };

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }, [open, updatePosition, contentRef, triggerRef, setOpen]);

    React.useEffect(() => {
      if (!open) return;

      const handlePointerDown = (e: MouseEvent | TouchEvent) => {
        const target = e.target as Node;
        if (
          contentRef.current &&
          !contentRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          setOpen(false);
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          triggerRef.current?.focus();
        }
      };

      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("touchstart", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mousedown", handlePointerDown);
        document.removeEventListener("touchstart", handlePointerDown);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [open, setOpen, contentRef, triggerRef]);

    if (!mounted || !open) return null;

    return ReactDOM.createPortal(
      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        role="listbox"
        style={{ ...posStyle, ...style }}
        className={cn(
          "overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xl ring-1 ring-slate-900/5 transition-all animate-in fade-in-80 duration-100",
          className
        )}
        {...props}
      >
        <div className="overflow-y-auto p-1.5 focus:outline-none" style={{ maxHeight: posStyle.maxHeight || "16rem" }}>
          {children}
        </div>
      </div>,
      document.body
    );
  }
);
SelectContent.displayName = "SelectContent";

export interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "py-2 pl-8 pr-2 text-xs font-semibold text-slate-500",
        className
      )}
      {...props}
    />
  )
);
SelectLabel.displayName = "SelectLabel";

export interface SelectItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ className, children, value, disabled, ...props }, ref) => {
    const { value: selectedValue, onValueChange, setOpen } = useSelect();
    const isSelected = selectedValue === value;

    return (
      <button
        ref={ref}
        type="button"
        role="option"
        aria-selected={isSelected}
        disabled={disabled}
        data-disabled={disabled ? "" : undefined}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (disabled) return;
          onValueChange(value);
          setOpen(false);
        }}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-lg my-0.5 py-2.5 pl-8 pr-3 text-xs font-medium outline-none transition-colors",
          "hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900",
          isSelected && "bg-blue-50 text-blue-700 font-semibold",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        {...props}
      >
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && <Check className="h-4 w-4 text-blue-600" />}
        </span>
        <span className="truncate">{children}</span>
      </button>
    );
  }
);
SelectItem.displayName = "SelectItem";

export interface SelectSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  SelectSeparatorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1.5 h-px bg-slate-100", className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";


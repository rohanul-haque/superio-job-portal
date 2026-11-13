"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import * as ReactDOM from "react-dom";

interface PopoverContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

export function usePopover() {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover components must be used within a <Popover />");
  }
  return context;
}

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Popover({
  open: openProp,
  defaultOpen = false,
  onOpenChange: onOpenChangeProp,
  children,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const currentOpen = isControlled ? !!openProp : uncontrolledOpen;

  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const handleOpenChange = React.useCallback(
    (updater: React.SetStateAction<boolean>) => {
      const nextOpen =
        typeof updater === "function" ? updater(currentOpen) : updater;
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChangeProp?.(nextOpen);
    },
    [currentOpen, isControlled, onOpenChangeProp]
  );

  const contextValue = React.useMemo<PopoverContextValue>(
    () => ({
      open: currentOpen,
      setOpen: handleOpenChange,
      triggerRef,
      contentRef,
    }),
    [currentOpen, handleOpenChange]
  );

  return (
    <PopoverContext.Provider value={contextValue}>
      {children}
    </PopoverContext.Provider>
  );
}

export interface PopoverTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(({ className, children, asChild = false, onClick, ...props }, ref) => {
  const { open, setOpen, triggerRef } = usePopover();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(e);
    setOpen((prev) => !prev);
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<
      React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
    >;
    return React.cloneElement(child, {
      ref: (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
        const childRef = (child as unknown as { ref?: React.Ref<HTMLElement> }).ref;
        if (typeof childRef === "function") childRef(node);
        else if (childRef && typeof childRef === "object") {
          (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      },
      "aria-haspopup": "dialog",
      "aria-expanded": open,
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        child.props.onClick?.(e);
        handleClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
      },
    });
  }

  return (
    <button
      ref={(node) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

export interface PopoverContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(
  (
    {
      className,
      children,
      align = "start",
      sideOffset = 6,
      style,
      ...props
    },
    ref
  ) => {
    const { open, setOpen, contentRef, triggerRef } = usePopover();
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

      let actualSide: "top" | "bottom" = "bottom";
      if (spaceBelow < 260 && spaceAbove > spaceBelow) {
        actualSide = "top";
      }

      const estimatedWidth = 300;
      let left = rect.left;
      if (align === "end") {
        left = rect.right - estimatedWidth;
      } else if (align === "center") {
        left = rect.left + rect.width / 2 - estimatedWidth / 2;
      }

      // Keep within horizontal screen bounds
      if (left + estimatedWidth > window.innerWidth - 12) {
        left = Math.max(8, window.innerWidth - estimatedWidth - 12);
      }
      if (left < 8) {
        left = 8;
      }

      const newStyle: React.CSSProperties = {
        position: "fixed",
        left: `${Math.round(left)}px`,
        zIndex: 9999,
      };

      if (actualSide === "bottom") {
        newStyle.top = `${Math.round(rect.bottom + sideOffset)}px`;
        newStyle.bottom = "auto";
        newStyle.maxHeight = `${Math.max(120, Math.min(380, Math.floor(spaceBelow - 16)))}px`;
      } else {
        newStyle.bottom = `${Math.round(window.innerHeight - rect.top + sideOffset)}px`;
        newStyle.top = "auto";
        newStyle.maxHeight = `${Math.max(120, Math.min(380, Math.floor(spaceAbove - 16)))}px`;
      }

      setPosStyle(newStyle);
    }, [triggerRef, align, sideOffset]);

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
    }, [open, updatePosition, contentRef]);

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
        role="dialog"
        style={{ ...posStyle, ...style }}
        className={cn(
          "z-50 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl ring-1 ring-slate-900/5 animate-in fade-in-80 zoom-in-95 duration-100",
          className
        )}
        {...props}
      >
        {children}
      </div>,
      document.body
    );
  }
);
PopoverContent.displayName = "PopoverContent";


"use client";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";
import * as React from "react";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 300; // Animation duration before removing from DOM
const SESSION_STORAGE_KEY = "hirenest_active_toasts";

export type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";

export const DEFAULT_TOAST_DURATIONS: Record<ToastVariant, number> = {
  success: 4000,
  default: 4500,
  info: 4500,
  warning: 5000,
  destructive: 5500,
};

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: ToastVariant;
  duration?: number;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return `toast-${Date.now()}-${count}`;
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

interface ToastTimerEntry {
  timeoutId: ReturnType<typeof setTimeout>;
  startedAt: number;
  remainingDuration: number;
  isPaused: boolean;
}

const activeTimers = new Map<string, ToastTimerEntry>();
const toastRemoveTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function clearToastTimer(id: string) {
  if (activeTimers.has(id)) {
    clearTimeout(activeTimers.get(id)!.timeoutId);
    activeTimers.delete(id);
  }
}

export function pauseToastTimer(id: string) {
  const entry = activeTimers.get(id);
  if (!entry || entry.isPaused) return;

  clearTimeout(entry.timeoutId);
  const elapsed = Date.now() - entry.startedAt;
  const remaining = Math.max(entry.remainingDuration - elapsed, 1000);

  activeTimers.set(id, {
    ...entry,
    remainingDuration: remaining,
    isPaused: true,
  });
}

export function resumeToastTimer(id: string) {
  const entry = activeTimers.get(id);
  if (!entry || !entry.isPaused) return;

  const timeoutId = setTimeout(() => {
    activeTimers.delete(id);
    dismiss(id);
  }, entry.remainingDuration);

  activeTimers.set(id, {
    ...entry,
    timeoutId,
    startedAt: Date.now(),
    isPaused: false,
  });
}

function startToastTimer(id: string, duration: number) {
  if (duration === Infinity) return;

  clearToastTimer(id);

  const timeoutId = setTimeout(() => {
    activeTimers.delete(id);
    dismiss(id);
  }, duration);

  activeTimers.set(id, {
    timeoutId,
    startedAt: Date.now(),
    remainingDuration: duration,
    isPaused: false,
  });
}

const addToRemoveQueue = (toastId: string) => {
  if (toastRemoveTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastRemoveTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastRemoveTimeouts.set(toastId, timeout);
};

// Persist active toasts to sessionStorage so they survive hard page reloads
interface PersistedToast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration: number;
  createdAt: number;
}

function saveToastToSession(item: PersistedToast) {
  if (typeof window === "undefined") return;
  try {
    const existing: PersistedToast[] = JSON.parse(
      sessionStorage.getItem(SESSION_STORAGE_KEY) || "[]",
    );
    existing.push(item);
    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(existing.slice(-TOAST_LIMIT)),
    );
  } catch {}
}

function removeToastFromSession(toastId: string) {
  if (typeof window === "undefined") return;
  try {
    const existing: PersistedToast[] = JSON.parse(
      sessionStorage.getItem(SESSION_STORAGE_KEY) || "[]",
    );
    const updated = existing.filter((t) => t.id !== toastId);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        clearToastTimer(toastId);
        addToRemoveQueue(toastId);
        removeToastFromSession(toastId);
      } else {
        state.toasts.forEach((toast) => {
          clearToastTimer(toast.id);
          addToRemoveQueue(toast.id);
          removeToastFromSession(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function dismiss(toastId?: string) {
  dispatch({ type: "DISMISS_TOAST", toastId });
}

export type Toast = Omit<ToasterToast, "id">;

export interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  duration?: number;
  className?: string;
  variant?: ToastVariant;
}

export type ToastInput =
  | React.ReactNode
  | (Omit<ToasterToast, "id"> & { message?: React.ReactNode });

function dispatchToast(
  input: ToastInput,
  options?: ToastOptions,
  defaultVariant: ToastVariant = "default",
) {
  const id = genId();
  const resolvedVariant: ToastVariant =
    (typeof input === "object" && input !== null && "variant" in input && input.variant)
      ? input.variant
      : options?.variant || defaultVariant;

  const defaultDuration = DEFAULT_TOAST_DURATIONS[resolvedVariant] || 4500;

  let toastProps: Omit<ToasterToast, "id">;

  if (
    typeof input === "string" ||
    typeof input === "number" ||
    React.isValidElement(input)
  ) {
    toastProps = {
      title: input as React.ReactNode,
      description: options?.description,
      action: options?.action,
      className: options?.className,
      duration: options?.duration ?? defaultDuration,
      variant: resolvedVariant,
    };
  } else if (typeof input === "object" && input !== null) {
    const { message, title, description, ...rest } = input as {
      message?: React.ReactNode;
      title?: React.ReactNode;
      description?: React.ReactNode;
    } & Omit<ToasterToast, "id">;

    toastProps = {
      ...rest,
      title: title || message,
      description: description || options?.description,
      action: rest.action || options?.action,
      className: rest.className || options?.className,
      duration: rest.duration ?? options?.duration ?? defaultDuration,
      variant: resolvedVariant,
    };
  } else {
    toastProps = {
      duration: defaultDuration,
      variant: resolvedVariant,
    };
  }

  const duration = toastProps.duration ?? defaultDuration;

  const update = (updatedProps: ToasterToast) => {
    if (updatedProps.duration) {
      startToastTimer(id, updatedProps.duration);
    }
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...updatedProps, id },
    });
  };

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...toastProps,
      id,
      open: true,
      duration,
      onOpenChange: (open) => {
        if (!open) dismiss(id);
      },
    },
  });

  // Start managed auto-dismiss timer
  startToastTimer(id, duration);

  // Persist string-based toasts to sessionStorage for cross-navigation survival
  if (typeof toastProps.title === "string" || typeof toastProps.description === "string") {
    saveToastToSession({
      id,
      title: typeof toastProps.title === "string" ? toastProps.title : undefined,
      description:
        typeof toastProps.description === "string"
          ? toastProps.description
          : undefined,
      variant: resolvedVariant,
      duration,
      createdAt: Date.now(),
    });
  }

  return {
    id,
    dismiss: () => dismiss(id),
    update,
  };
}

export interface ToastFn {
  (input: ToastInput, options?: ToastOptions): {
    id: string;
    dismiss: () => void;
    update: (updatedProps: ToasterToast) => void;
  };
  success: (input: ToastInput, options?: ToastOptions) => {
    id: string;
    dismiss: () => void;
    update: (updatedProps: ToasterToast) => void;
  };
  error: (input: ToastInput, options?: ToastOptions) => {
    id: string;
    dismiss: () => void;
    update: (updatedProps: ToasterToast) => void;
  };
  warning: (input: ToastInput, options?: ToastOptions) => {
    id: string;
    dismiss: () => void;
    update: (updatedProps: ToasterToast) => void;
  };
  info: (input: ToastInput, options?: ToastOptions) => {
    id: string;
    dismiss: () => void;
    update: (updatedProps: ToasterToast) => void;
  };
  dismiss: (toastId?: string) => void;
}

const toast: ToastFn = ((input: ToastInput, options?: ToastOptions) => {
  return dispatchToast(input, options, "default");
}) as ToastFn;

toast.success = (input: ToastInput, options?: ToastOptions) => {
  return dispatchToast(input, options, "success");
};

toast.error = (input: ToastInput, options?: ToastOptions) => {
  return dispatchToast(input, options, "destructive");
};

toast.warning = (input: ToastInput, options?: ToastOptions) => {
  return dispatchToast(input, options, "warning");
};

toast.info = (input: ToastInput, options?: ToastOptions) => {
  return dispatchToast(input, options, "info");
};

toast.dismiss = (toastId?: string) => {
  dismiss(toastId);
};

// Check for and restore persisted toasts on client mount
function restorePersistedToasts() {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return;
    const items: PersistedToast[] = JSON.parse(raw);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);

    const now = Date.now();
    items.forEach((item) => {
      const elapsed = now - item.createdAt;
      const remaining = item.duration - elapsed;
      if (remaining > 1000) {
        toast({
          title: item.title,
          description: item.description,
          variant: item.variant,
          duration: remaining,
        });
      }
    });
  } catch {}
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    restorePersistedToasts();

    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss,
  };
}

export { toast, useToast };

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import {
  isExplicitLogout,
  setExplicitLogout,
  setSessionActive,
} from "../services/api";
import { authService } from "../services/auth.service";
import type { IAuthUser, ILoginPayload, UserRole } from "../types/auth";

interface AuthContextType {
  user: IAuthUser | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: ILoginPayload) => Promise<IAuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: IAuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userRef = useRef<IAuthUser | null>(null);

  // Keep ref synchronized with state for event listeners
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Initialize authentication on application mount via backend cookie session
  const initializeAuth = useCallback(async () => {
    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
      setSessionActive(true);
    } catch {
      // 401 indicates unauthenticated guest or missing/expired session
      setUser(null);
      setSessionActive(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Listen for session expiry from automatic refresh failure
  useEffect(() => {
    const handleSessionExpired = () => {
      // Never show session-expired toast if user was already unauthenticated or explicitly logging out
      if (!isExplicitLogout() && userRef.current !== null) {
        setUser(null);
        setSessionActive(false);
        toast.error("Your session has expired. Please sign in again.");
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("superio:session-expired", handleSessionExpired);
      return () => {
        window.removeEventListener(
          "superio:session-expired",
          handleSessionExpired,
        );
      };
    }
  }, []);

  const login = async (credentials: ILoginPayload): Promise<IAuthUser> => {
    setIsLoading(true);
    setExplicitLogout(false);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setSessionActive(true);
      toast.success(`Welcome back, ${response.user.name}!`);
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Unified Global Logout
   * Clears the active browser session for any role (Candidate, Recruiter, Admin),
   * clears frontend authentication state, triggers backend HTTP-only cookie deletion,
   * prevents token refresh calls, and navigates cleanly to the public homepage.
   */
  const logout = async (): Promise<void> => {
    setExplicitLogout(true);
    setSessionActive(false);
    setUser(null);

    try {
      await authService.logout();
    } catch (error) {
      console.error("Error during server logout:", error);
    } finally {
      toast.info("You have been signed out.");
      setExplicitLogout(false);

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
      setSessionActive(true);
    } catch (err) {
      console.error("Error refreshing user profile:", err);
      setUser(null);
      setSessionActive(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

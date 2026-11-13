"use client";

import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types/auth";
import { AlertCircle, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // Never set returnUrl to a login/register route or home page
      const isAuthPath =
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/admin/login" ||
        pathname === "/candidate-login" ||
        pathname === "/recruiter-login" ||
        pathname === "/candidate-signup" ||
        pathname === "/recruiter-signup" ||
        pathname === "/verify-email" ||
        pathname === "/forgot-password" ||
        pathname === "/";

      const isAdminPath =
        pathname === "/admin" ||
        (pathname.startsWith("/admin/") && pathname !== "/admin/login");
      const isRecruiterPath =
        pathname === "/recruiter" || pathname.startsWith("/recruiter/");

      // Admin routes redirect strictly to the dedicated Admin Gateway
      if (isAdminPath) {
        const adminParams = new URLSearchParams();
        if (!isAuthPath && pathname !== "/admin" && pathname !== "/admin/dashboard") {
          adminParams.set("returnUrl", pathname);
        }
        const qs = adminParams.toString();
        router.replace(qs ? `/admin/login?${qs}` : "/admin/login");
        return;
      }

      const role = isRecruiterPath ? "recruiter" : "candidate";
      const params = new URLSearchParams();
      params.set("role", role);

      if (!isAuthPath && pathname !== "/") {
        params.set("returnUrl", pathname);
      }

      router.replace(`/login?${params.toString()}`);
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Role mismatch: redirect to the user's authorized portal
      if (user.role === "recruiter") {
        router.replace("/recruiter/dashboard");
      } else if (user.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/candidate/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router, pathname]);

  // Loading state: prevent flashing protected content
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">
          Verifying security credentials...
        </p>
      </div>
    );
  }

  // Not authenticated: render nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Role mismatch fallback
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="mx-auto my-12 max-w-md p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Access Restricted
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          You do not have permission to access this page with your {user.role}{" "}
          account. Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

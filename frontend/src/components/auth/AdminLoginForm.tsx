"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const sanitizeReturnUrl = (url: string | null, fallback: string): string => {
  if (!url) return fallback;
  try {
    const decoded = decodeURIComponent(url);
    if (
      !decoded.startsWith("/admin") ||
      decoded.startsWith("/admin/login") ||
      decoded === "/admin"
    ) {
      return fallback;
    }
    return decoded;
  } catch {
    return fallback;
  }
};

export const AdminLoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawReturnUrl = searchParams.get("returnUrl");
  const returnUrl = sanitizeReturnUrl(rawReturnUrl, "/admin/dashboard");

  const {
    login,
    logout,
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated as an Admin, redirect immediately to dashboard
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user) {
      if (user.role === "admin") {
        router.replace(returnUrl);
      }
    }
  }, [isAuthLoading, isAuthenticated, user, returnUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!email.trim() || !password) {
      setErrorMessage(
        "Please enter both your administrator email and password."
      );
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      // 1. Authenticate using existing backend login API with role: "admin"
      const authUser = await login({
        email: email.trim(),
        password,
        role: "admin",
      });

      // 2. Strict Role Verification: Ensure authenticated user is an ADMIN
      if (authUser.role !== "admin") {
        // Deny access and revoke session for non-admin accounts
        await logout();
        setErrorMessage(
          `Access Denied: This portal is strictly restricted to Platform Administrators. The account '${authUser.email}' holds the '${authUser.role}' role.`
        );
        toast.error(
          "Unauthorized: Platform Administrator privileges required."
        );
        return;
      }

      // 3. Grant access to Admin Dashboard
      toast.success("Administrator session verified. Welcome back!");
      router.push(returnUrl);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(
        error.message ||
          "Authentication failed. Invalid administrator credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-slate-200/80 shadow-xl shadow-slate-200/50">
      <CardHeader className="space-y-4 text-center pb-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-8 ring-blue-50/50">
          <Lock className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Admin Sign In
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Sign in to your Superio Administrator account
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <div className="flex-1">
                <p className="font-semibold text-xs">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Admin Email Address</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@superio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="admin-password">Password</Label>
            </div>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In as Administrator
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 p-6 text-center text-sm text-slate-600">
        <p>
          Candidate or Recruiter?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            User Sign In
          </Link>
        </p>
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-slate-600 hover:underline"
        >
          ← Back to Superio Homepage
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AdminLoginForm;

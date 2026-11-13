"use client";

import EmailVerificationModal from "@/components/auth/EmailVerificationModal";
import RoleSelector, { RoleType } from "@/components/auth/RoleSelector";
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
import React, { useState } from "react";
import { toast } from "sonner";

interface LoginFormProps {
  initialRole?: RoleType;
}

const sanitizeReturnUrl = (url: string | null, fallback: string): string => {
  if (!url) return fallback;
  try {
    const decoded = decodeURIComponent(url);
    if (
      !decoded.startsWith("/") ||
      decoded.startsWith("//") ||
      decoded.startsWith("/login") ||
      decoded.startsWith("/register") ||
      decoded.startsWith("/admin/login") ||
      decoded.startsWith("/candidate-login") ||
      decoded.startsWith("/recruiter-login") ||
      decoded.startsWith("/candidate-signup") ||
      decoded.startsWith("/recruiter-signup") ||
      decoded.startsWith("/verify-email") ||
      decoded.startsWith("/forgot-password") ||
      decoded === "/"
    ) {
      return fallback;
    }
    return decoded;
  } catch {
    return fallback;
  }
};

export const LoginForm: React.FC<LoginFormProps> = ({
  initialRole = "candidate",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryRole = searchParams.get("role") as RoleType | null;
  const rawReturnUrl = searchParams.get("returnUrl");

  const [selectedRole, setSelectedRole] = useState<RoleType>(
    queryRole === "recruiter" || queryRole === "candidate"
      ? queryRole
      : initialRole,
  );

  const defaultDashboard =
    selectedRole === "recruiter"
      ? "/recruiter/dashboard"
      : "/candidate/dashboard";
  const returnUrl = sanitizeReturnUrl(rawReturnUrl, defaultDashboard);

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUnverified, setIsUnverified] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setErrorMessage(null);
    setIsUnverified(false);
    setIsLoading(true);

    try {
      const authUser = await login({
        email: email.trim(),
        password,
        role: selectedRole,
      });

      if (authUser.role === "admin") {
        router.push("/admin/dashboard");
      } else if (authUser.role === "recruiter") {
        const destination = returnUrl.startsWith("/candidate")
          ? "/recruiter/dashboard"
          : returnUrl;
        router.push(destination);
      } else {
        const destination = returnUrl.startsWith("/recruiter")
          ? "/candidate/dashboard"
          : returnUrl;
        router.push(destination);
      }
    } catch (err: unknown) {
      const error = err as { statusCode?: number; message?: string };
      const msg =
        error.message || "Login failed. Please verify your email and password.";
      setErrorMessage(msg);

      if (
        error.statusCode === 403 ||
        msg.toLowerCase().includes("verify") ||
        msg.toLowerCase().includes("verification")
      ) {
        setIsUnverified(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <EmailVerificationModal
        isOpen={isUnverified}
        onClose={() => setIsUnverified(false)}
        mode="login"
        email={email.trim()}
      />

      <Card className="border border-slate-200/80 shadow-xl shadow-slate-200/50">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-8 ring-blue-50/50">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Sign in to continue to your Superio {selectedRole} account
            </CardDescription>
          </div>

          {/* Reference Role Selector Toggle */}
          <RoleSelector
            selectedRole={selectedRole}
            onChange={(role) => {
              setSelectedRole(role);
              setErrorMessage(null);
              setIsUnverified(false);
            }}
            className="mt-2"
          />
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
            <Label htmlFor="login-email">
              {selectedRole === "recruiter"
                ? "Work Email Address"
                : "Email Address"}
            </Label>
            <Input
              id="login-email"
              type="email"
              placeholder={
                selectedRole === "recruiter"
                  ? "hr@company.com"
                  : "candidate@example.com"
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="login-password"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In as{" "}
                {selectedRole === "recruiter" ? "Recruiter" : "Candidate"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 p-6 text-center text-sm text-slate-600">
        <p>
          Don&apos;t have an account?{" "}
          <Link
            href={`/register?role=${selectedRole}`}
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Register Now
          </Link>
        </p>
      </CardFooter>
    </Card>
    </>
  );
};

export default LoginForm;

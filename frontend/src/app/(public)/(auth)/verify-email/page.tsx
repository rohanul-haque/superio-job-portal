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
import { authService } from "@/services/auth.service";
import type { IVerifyEmailResponse } from "@/types/auth";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  MailCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  // Verification state: checking (cookie check), success, cross_device (credentials required), error
  const [stage, setStage] = useState<
    "checking" | "success" | "cross_device" | "error"
  >("checking");

  const [verifiedData, setVerifiedData] = useState<{
    role: string;
    name: string;
  } | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cross-device credential form
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [isSubmittingCredentials, setIsSubmittingCredentials] = useState(false);

  // Resend form
  const [resendEmail, setResendEmail] = useState(initialEmail);
  const [isResending, setIsResending] = useState(false);
  const [showResend, setShowResend] = useState(false);

  // 1. Same-Browser Verification on mount (using HTTP-only cookie)
  useEffect(() => {
    let isMounted = true;

    const attemptCookieVerification = async () => {
      try {
        const result = await authService.verifyEmail();
        if (isMounted) {
          setVerifiedData({
            name: result.user.name,
            role: result.role || result.user.role,
          });
          setStage("success");
          toast.success(result.message || "Email verified successfully!");
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const error = err as { statusCode?: number; message?: string };

        // 401 indicates missing or expired cookie: switch to cross-device credentials verification
        if (
          error.statusCode === 401 ||
          error.message?.toLowerCase().includes("session cookie not found") ||
          error.message?.toLowerCase().includes("verification session")
        ) {
          setStage("cross_device");
          setErrorMessage(
            "Session cookie was not detected. If you opened this link on a new device or browser, please verify with your account credentials.",
          );
        } else {
          setStage("error");
          setErrorMessage(
            error.message ||
              "Email verification failed. The session may have expired.",
          );
        }
      }
    };

    attemptCookieVerification();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Cross-Device / New-Browser Verification submit handler
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please provide both your registered email and password.");
      return;
    }

    setIsSubmittingCredentials(true);
    setErrorMessage(null);

    try {
      const result = await authService.verifyEmailWithCredentials({
        email: email.trim(),
        password,
      });

      setVerifiedData({
        name: result.user.name,
        role: result.role || result.user.role,
      });
      setStage("success");
      toast.success(result.message || "Email verified successfully!");
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(
        error.message || "Verification failed. Please check your credentials.",
      );
      toast.error(error.message || "Failed to verify account.");
    } finally {
      setIsSubmittingCredentials(false);
    }
  };

  // 3. Resend Verification Email handler
  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = resendEmail.trim() || email.trim();
    if (!targetEmail) {
      toast.error("Please enter your email to request a fresh verification link.");
      return;
    }

    setIsResending(true);
    try {
      const message = await authService.resendVerification(targetEmail);
      toast.success(
        message || "A fresh verification email has been dispatched via Gmail.",
      );
      setShowResend(false);
      setErrorMessage(null);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to dispatch verification email.");
    } finally {
      setIsResending(false);
    }
  };

  // ==================== STATE 1: CHECKING (LOADING) ====================
  if (stage === "checking") {
    return (
      <Card className="border border-slate-200/80 shadow-xl text-center p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 ring-8 ring-blue-50/50">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
        <CardTitle className="text-xl font-bold text-slate-900">
          Validating Email Verification...
        </CardTitle>
        <CardDescription className="mt-2 text-slate-500">
          Checking your secure verification session cookie with the server.
        </CardDescription>
      </Card>
    );
  }

  // ==================== STATE 2: SUCCESS ====================
  if (stage === "success") {
    const isRecruiter = verifiedData?.role === "recruiter";
    const loginUrl = isRecruiter ? "/recruiter-login" : "/candidate-login";

    return (
      <Card className="border border-emerald-200 shadow-xl text-center p-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50 mb-4">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <CardTitle className="text-2xl font-bold text-slate-900">
          Email Verified Successfully!
        </CardTitle>
        <CardDescription className="mt-2 text-slate-600">
          Welcome aboard, <strong>{verifiedData?.name}</strong>. Your{" "}
          <span className="capitalize font-semibold">{verifiedData?.role}</span> account is now fully activated.
        </CardDescription>

        <div className="my-6 rounded-xl bg-emerald-50/70 border border-emerald-200 p-4 text-sm text-emerald-800">
          You can now sign in to your dashboard to post jobs or submit applications.
        </div>

        <Link href={loginUrl}>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Proceed to {isRecruiter ? "Recruiter" : "Candidate"} Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </Card>
    );
  }

  // ==================== STATE 3: CROSS-DEVICE OR ERROR ====================
  return (
    <Card className="border border-slate-200/80 shadow-xl shadow-slate-200/50">
      <CardHeader className="space-y-2 text-center pb-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-8 ring-blue-50/50">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
          Email Verification
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          {stage === "cross_device"
            ? "Opened on a new device or browser? Verify with credentials"
            : "Complete verification to activate your Superio account"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {errorMessage && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="font-semibold text-xs leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Cross-Device / New-Browser Verification Form */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verify-email">Registered Email Address</Label>
            <Input
              id="verify-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="verify-password">Account Password</Label>
            <Input
              id="verify-password"
              type="password"
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmittingCredentials}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSubmittingCredentials ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying Credentials...
              </>
            ) : (
              <>
                Verify & Activate Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Resend Section Toggle */}
        <div className="pt-2 border-t border-slate-100 text-center">
          {!showResend ? (
            <button
              type="button"
              onClick={() => setShowResend(true)}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Need a new verification email? Click here to resend
            </button>
          ) : (
            <form onSubmit={handleResend} className="mt-3 space-y-3 text-left">
              <Label htmlFor="resend-email" className="text-xs">
                Email for Fresh Verification Dispatch
              </Label>
              <div className="flex gap-2">
                <Input
                  id="resend-email"
                  type="email"
                  placeholder="Enter email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="text-xs"
                  required
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  disabled={isResending}
                  className="shrink-0 text-xs border-slate-300"
                >
                  {isResending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Send Email"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-slate-100 bg-slate-50/50 p-6 text-sm text-slate-600">
        <Link
          href="/candidate-login"
          className="text-xs font-medium text-slate-500 hover:text-blue-600"
        >
          Return to Login
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Card className="border border-slate-200/80 shadow-xl text-center p-8">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-blue-600" />
          <p className="mt-2 text-sm text-slate-500">Loading verification...</p>
        </Card>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

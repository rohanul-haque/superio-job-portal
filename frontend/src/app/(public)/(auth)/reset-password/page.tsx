"use client";

import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { resetPassword } from "@/services/auth.service";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If token is missing entirely from URL
  if (!token) {
    return (
      <div className="space-y-5 text-center">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-amber-600" />
          <h3 className="font-bold text-base text-amber-950">
            Invalid Reset Link
          </h3>
          <p className="mt-1.5 text-xs text-amber-800 leading-relaxed">
            No password reset token was found in the link. Please verify that
            you copied the full URL from your email or request a new reset link.
          </p>
        </div>

        <Link href="/forgot-password" className="block">
          <Button
            type="button"
            className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-full font-semibold h-11"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Request New Reset Link
          </Button>
        </Link>
      </div>
    );
  }

  // If password was successfully reset
  if (isSuccess) {
    return (
      <div className="space-y-5 text-center">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
          <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-600" />
          <h3 className="font-bold text-base text-emerald-950">
            Password Reset Complete!
          </h3>
          <p className="mt-1.5 text-xs text-emerald-700 leading-relaxed">
            Your password has been successfully updated. You can now use your
            new password to sign in to your HireNest account.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-full font-semibold h-11"
        >
          Sign In Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please ensure both fields are identical.");
      return;
    }

    setLoading(true);
    try {
      const message = await resetPassword({
        token,
        newPassword,
      });
      setIsSuccess(true);
      toast.success(message || "Password has been reset successfully.");
    } catch (error: unknown) {
      const apiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        apiError.response?.data?.message ||
        apiError.message ||
        "Password reset failed. The link may have expired or already been used.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 font-medium space-y-2">
          <p>{errorMessage}</p>
          <div className="pt-1">
            <Link
              href="/forgot-password"
              className="font-semibold text-red-800 underline hover:text-red-900"
            >
              Request a new password reset link
            </Link>
          </div>
        </div>
      )}

      {/* New Password */}
      <div className="space-y-1.5">
        <Label
          htmlFor="newPassword"
          className="text-xs font-semibold text-[#0F172A]"
        >
          New Password
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            className="rounded-xl border-[#E5E7EB] text-sm pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          Must be at least 6 characters.
        </p>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label
          htmlFor="confirmPassword"
          className="text-xs font-semibold text-[#0F172A]"
        >
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            className="rounded-xl border-[#E5E7EB] text-sm pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-full font-semibold h-11 mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting Password...
          </>
        ) : (
          <>
            Save New Password
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Card className="rounded-2xl border border-[#E5E7EB] bg-white shadow-none">
      <CardHeader className="space-y-4 text-center pb-6">
        <div className="flex justify-center pb-1">
          <Logo href="/" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Create New Password
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Choose a strong, unique password for your HireNest account
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <Suspense
          fallback={
            <div className="py-8 text-center text-slate-400">
              <Loader2 className="mx-auto h-6 w-6 animate-spin" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-[#E5E7EB] bg-slate-50/50 p-6 text-sm text-slate-600 rounded-b-2xl">
        <Link
          href="/login"
          className="flex items-center gap-1.5 font-medium hover:text-[#4F46E5] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}

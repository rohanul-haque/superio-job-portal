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
import { forgotPassword } from "@/services/auth.service";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      const message = await forgotPassword(trimmedEmail);
      setSubmitted(true);
      toast.success(message || "Password reset instructions dispatched.");
    } catch (error: unknown) {
      const apiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        apiError.response?.data?.message ||
        apiError.message ||
        "An unexpected error occurred. Please try again later.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <Card className="rounded-2xl border border-[#E5E7EB] bg-white shadow-none">
      <CardHeader className="space-y-4 text-center pb-6">
        <div className="flex justify-center pb-1">
          <Logo href="/" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Reset Password
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Enter your registered email address to receive password reset instructions
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {submitted ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center text-sm text-emerald-900">
              <CheckCircle2 className="mx-auto mb-2.5 h-8 w-8 text-emerald-600" />
              <p className="font-semibold text-base">Check Your Inbox</p>
              <p className="mt-1 text-xs text-emerald-700 leading-relaxed">
                If an eligible Candidate or Recruiter account exists with <strong>{email}</strong>, you will receive a secure password reset link shortly.
              </p>
              <p className="mt-2 text-[11px] text-emerald-600 font-medium">
                The link is valid for 15 minutes.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleResetForm}
              className="w-full rounded-full text-xs font-semibold h-10 border-[#E5E7EB]"
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Try another email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-[#0F172A]"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="rounded-xl border-[#E5E7EB] text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-full font-semibold h-11"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}
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

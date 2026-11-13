"use client";

import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { CheckCircle2, Loader2, MailCheck, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export type EmailVerificationModalMode = "registration" | "login";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: EmailVerificationModalMode;
  email?: string;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  mode = "registration",
  email = "",
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccessMessage, setResendSuccessMessage] = useState<
    string | null
  >(null);

  // Reset resend states when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setResendSuccessMessage(null);
      setIsResending(false);
    }
  }, [isOpen, mode]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isRegistration = mode === "registration";

  const title = isRegistration
    ? "Please Check Your Inbox"
    : "Email Not Verified";

  const description = isRegistration
    ? "Your account has been created successfully. Please check your inbox and verify your email address to continue."
    : "Your email address has not been verified yet. Please verify your email to access your account. You can request a new verification email below if needed.";

  const handleResend = async () => {
    if (!email.trim()) {
      toast.error(
        "Email address not found. Please re-enter your credentials to resend.",
      );
      return;
    }

    if (isResending) return;

    setIsResending(true);
    setResendSuccessMessage(null);

    try {
      await authService.resendVerification(email.trim());

      const successMsg =
        "A new verification email has been sent successfully. Please check your inbox. The verification link is valid for 5 minutes.";

      setResendSuccessMessage(successMsg);
      toast.success(successMsg);
    } catch (err: unknown) {
      const error = err as { message?: string; statusCode?: number };
      const msg = error.message || "Failed to resend verification email.";

      if (msg.toLowerCase().includes("already verified")) {
        toast.info(
          "This account has already verified its email. You can proceed directly to log in.",
        );
        onClose();
      } else {
        toast.error(msg);
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150 text-center"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-verification-title"
      >
        {/* Dismiss Close Icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition outline-none cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Visual Email Verification Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50 mb-5">
          <MailCheck className="h-8 w-8" />
        </div>

        {/* Modal Title */}
        <h2
          id="email-verification-title"
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          {title}
        </h2>

        {/* Description */}
        <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
          {description}
        </p>

        {/* Resend Success Banner if triggered */}
        {resendSuccessMessage && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left text-xs text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
            <p className="font-medium leading-relaxed">{resendSuccessMessage}</p>
          </div>
        )}

        {/* Action Button: ONLY 'Resend Verification Email' */}
        <div className="mt-6">
          <Button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-xs transition cursor-pointer"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Verification Email...
              </>
            ) : (
              "Resend Verification Email"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;

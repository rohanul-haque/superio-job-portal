import LoginForm from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign In — Superio Job Portal",
  description: "Sign in to your Candidate or Recruiter account on Superio.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Card className="border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.05)] text-center p-8">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-blue-600" />
          <p className="mt-2 text-sm text-slate-500">Loading sign in...</p>
        </Card>
      }
    >
      <LoginForm />
    </Suspense>
  );
}


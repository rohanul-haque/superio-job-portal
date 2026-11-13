import LoginForm from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Candidate Sign In — Superio Job Portal",
  description: "Sign in to your candidate account on Superio.",
};

export default function CandidateLoginPage() {
  return (
    <Suspense
      fallback={
        <Card className="border border-slate-200/80 shadow-xl text-center p-8">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-blue-600" />
          <p className="mt-2 text-sm text-slate-500">Loading sign in...</p>
        </Card>
      }
    >
      <LoginForm initialRole="candidate" />
    </Suspense>
  );
}

import LoginForm from "@/components/auth/LoginForm";
import { AuthCardSkeleton } from "@/components/shared/skeletons";
import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Candidate Sign In — Superio Job Portal",
  description: "Sign in to your candidate account on Superio.",
};

export default function CandidateLoginPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton />}>
      <LoginForm initialRole="candidate" />
    </Suspense>
  );
}

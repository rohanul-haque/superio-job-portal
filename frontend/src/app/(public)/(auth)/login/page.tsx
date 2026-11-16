import LoginForm from "@/components/auth/LoginForm";
import { AuthCardSkeleton } from "@/components/shared/skeletons";
import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign In — Superio Job Portal",
  description: "Sign in to your Candidate or Recruiter account on Superio.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}


import LoginForm from "@/components/auth/LoginForm";
import { AuthCardSkeleton } from "@/components/shared/skeletons";
import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Recruiter Sign In — Superio Job Portal",
  description: "Sign in to your recruiter or company account on Superio.",
};

export default function RecruiterLoginPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton />}>
      <LoginForm initialRole="recruiter" />
    </Suspense>
  );
}

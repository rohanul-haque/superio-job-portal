import RegisterForm from "@/components/auth/RegisterForm";
import { AuthCardSkeleton } from "@/components/shared/skeletons";
import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Recruiter Registration — Superio Job Portal",
  description: "Create an employer or recruiter account on Superio Job Portal.",
};

export default function RecruiterSignupPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton />}>
      <RegisterForm initialRole="recruiter" />
    </Suspense>
  );
}

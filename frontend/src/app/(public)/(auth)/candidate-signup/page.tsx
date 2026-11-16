import RegisterForm from "@/components/auth/RegisterForm";
import { AuthCardSkeleton } from "@/components/shared/skeletons";
import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Candidate Registration — Superio Job Portal",
  description: "Create a candidate account on Superio Job Portal.",
};

export default function CandidateSignupPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton />}>
      <RegisterForm initialRole="candidate" />
    </Suspense>
  );
}

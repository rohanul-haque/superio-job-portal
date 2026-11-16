import RegisterForm from "@/components/auth/RegisterForm";
import { AuthCardSkeleton } from "@/components/shared/skeletons";
import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Register Account — Superio Job Portal",
  description:
    "Create your Candidate or Recruiter account on Superio Job Portal.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}


import RegisterForm from "@/components/auth/RegisterForm";
import { AuthCardSkeleton } from "@/components/shared/skeletons";
import React, { Suspense } from "react";


export default function RecruiterSignupPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton />}>
      <RegisterForm initialRole="recruiter" />
    </Suspense>
  );
}

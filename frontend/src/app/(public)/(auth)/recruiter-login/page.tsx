import LoginForm from "@/components/auth/LoginForm";
import { AuthCardSkeleton } from "@/components/shared/skeletons";
import React, { Suspense } from "react";


export default function RecruiterLoginPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton />}>
      <LoginForm initialRole="recruiter" />
    </Suspense>
  );
}

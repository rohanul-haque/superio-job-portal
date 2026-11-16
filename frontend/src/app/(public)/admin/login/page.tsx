import AdminLoginForm from "@/components/auth/AdminLoginForm";
import { AuthCardSkeleton } from "@/components/shared/skeletons";
import React, { Suspense } from "react";


export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full max-w-md">
        <Suspense fallback={<AuthCardSkeleton />}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}

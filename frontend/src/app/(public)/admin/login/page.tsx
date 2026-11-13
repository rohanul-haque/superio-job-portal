import AdminLoginForm from "@/components/auth/AdminLoginForm";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Admin Sign In — Superio Job Portal",
  description:
    "Secure single sign-on access gateway for Superio Enterprise Platform Administrators.",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-50">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <Card className="border border-slate-200/80 shadow-xl text-center p-8">
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-blue-600" />
              <p className="mt-2 text-sm text-slate-500">
                Loading administrator sign in...
              </p>
            </Card>
          }
        >
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}

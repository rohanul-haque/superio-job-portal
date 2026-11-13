"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";
import React from "react";

export default function CandidateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["candidate"]}>
      <DashboardShell role="candidate">{children}</DashboardShell>
    </ProtectedRoute>
  );
}

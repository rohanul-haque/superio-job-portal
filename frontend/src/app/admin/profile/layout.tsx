"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";
import React from "react";

export default function AdminProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardShell role="admin">{children}</DashboardShell>
    </ProtectedRoute>
  );
}


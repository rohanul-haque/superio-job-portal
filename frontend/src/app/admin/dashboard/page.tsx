import { AdminDashboard } from "@/components/admin/dashboard/AdminDashboard";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Governance Console — HireNest Admin",
  description: "Real-time platform metrics, user moderation, taxonomy controls, and system health.",
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}

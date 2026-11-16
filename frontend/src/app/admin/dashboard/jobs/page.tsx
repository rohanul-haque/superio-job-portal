import { AdminJobsDirectory } from "@/components/admin/jobs/AdminJobsDirectory";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Master Job Directory — HireNest Admin",
  description:
    "Platform-wide governance across all employers, categories, hiring statuses, and public listings.",
};

export default function AdminManageJobsPage() {
  return <AdminJobsDirectory />;
}

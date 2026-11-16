import { RecruiterDashboard } from "@/components/recruiter/dashboard/RecruiterDashboard";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Recruiter Dashboard — HireNest",
  description: "Monitor job postings, candidate submissions, and recruitment analytics.",
};

export default function RecruiterDashboardOverviewPage() {
  return <RecruiterDashboard />;
}

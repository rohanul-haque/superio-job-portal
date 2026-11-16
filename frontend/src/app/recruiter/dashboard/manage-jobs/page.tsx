import { ManageJobsList } from "@/components/recruiter/jobs/ManageJobsList";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Manage Jobs — HireNest",
  description: "View, edit, toggle visibility, and control hiring statuses of your job postings.",
};

export default function RecruiterManageJobsPage() {
  return <ManageJobsList />;
}

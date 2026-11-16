import ApplicationList from "@/components/candidate/applications/ApplicationList";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Applied Jobs — HireNest",
  description: "View and manage your submitted job applications.",
};

export default function CandidateAppliedJobsPage() {
  return <ApplicationList />;
}

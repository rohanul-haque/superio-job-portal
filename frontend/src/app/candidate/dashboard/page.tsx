import CandidateDashboard from "@/components/candidate/dashboard/CandidateDashboard";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Candidate Dashboard — HireNest",
  description:
    "Candidate application performance, real-time analytics, and recent application telemetry.",
};

export default function CandidateDashboardPage() {
  return <CandidateDashboard />;
}

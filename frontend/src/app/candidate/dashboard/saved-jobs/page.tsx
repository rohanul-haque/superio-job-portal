import SavedJobsList from "@/components/candidate/saved-jobs/SavedJobsList";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Saved Jobs — HireNest",
  description: "View and manage your bookmarked job vacancies.",
};

export default function CandidateSavedJobsPage() {
  return <SavedJobsList />;
}

import JobDetailsView from "@/components/jobs/JobDetailsView";
import type { Metadata } from "next";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Job Details & Application — Superio Job Portal",
  description:
    "Review complete job overview, vacancy specifications, company profile, and submit your application on Superio Enterprise.",
};

export default async function ApplyJobPage({ params }: PageProps) {
  const { id } = await params;
  return <JobDetailsView id={id} />;
}


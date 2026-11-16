import { JobForm } from "@/components/recruiter/jobs/JobForm";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Edit Job Vacancy — HireNest",
  description: "Update requirements, salary range, deadline, and visibility settings.",
};

export default async function RecruiterEditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <JobForm mode="edit" jobId={id} />;
}

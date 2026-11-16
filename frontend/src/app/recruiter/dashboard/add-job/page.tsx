import { JobForm } from "@/components/recruiter/jobs/JobForm";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Publish Job Vacancy — HireNest",
  description: "Create an active job opening and match with qualified candidate talent.",
};

export default function RecruiterAddJobPage() {
  return <JobForm mode="create" />;
}

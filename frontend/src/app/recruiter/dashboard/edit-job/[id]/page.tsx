import JobForm from "@/components/recruiter/jobs/JobForm";
import React from "react";


export default async function RecruiterEditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <JobForm mode="edit" jobId={id} />;
}

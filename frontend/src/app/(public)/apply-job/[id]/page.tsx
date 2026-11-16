import JobDetailsView from "@/components/jobs/JobDetailsView";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}


export default async function ApplyJobPage({ params }: PageProps) {
  const { id } = await params;
  return <JobDetailsView id={id} />;
}


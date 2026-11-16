import ApplicantsList from "@/components/recruiter/applicants/ApplicantsList";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Candidate Applicants — HireNest",
  description: "Review applicant resumes, inspect candidate profiles, and manage hiring pipeline stages.",
};

export default function RecruiterViewApplicantsPage() {
  return <ApplicantsList />;
}

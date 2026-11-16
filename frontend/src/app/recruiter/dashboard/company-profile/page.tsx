import { CompanyProfile } from "@/components/recruiter/profile/CompanyProfile";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Company Profile — HireNest",
  description: "Maintain your enterprise brand identity, headquarters info, logo, and public presence.",
};

export default function RecruiterCompanyProfilePage() {
  return <CompanyProfile />;
}

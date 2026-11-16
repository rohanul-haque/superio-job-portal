import { CandidateProfile } from "@/components/candidate/profile/CandidateProfile";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "My Profile — HireNest",
  description: "View and edit your candidate profile, resume, and skills.",
};

export default function CandidateProfilePage() {
  return <CandidateProfile />;
}

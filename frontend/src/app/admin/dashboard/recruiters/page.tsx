import { RecruiterModerationList } from "@/components/admin/recruiters/RecruiterModerationList";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Recruiter Moderation — HireNest Admin",
  description: "Inspect verified employers, monitor job postings, block suspicious accounts, and soft-delete organizations.",
};

export default function AdminRecruitersPage() {
  return <RecruiterModerationList />;
}

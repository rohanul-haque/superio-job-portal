import { CandidateModerationList } from "@/components/admin/candidates/CandidateModerationList";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Candidate Moderation — HireNest Admin",
  description: "Review registered talent, inspect credentials, block abusive accounts, and soft-delete users.",
};

export default function AdminCandidatesPage() {
  return <CandidateModerationList />;
}

import { TrashCenter } from "@/components/admin/trash/TrashCenter";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Trash & Restore Center — HireNest Admin",
  description: "Centralized recovery console for soft-deleted candidates, recruiters, jobs, and categories.",
};

export default function AdminTrashCenterPage() {
  return <TrashCenter />;
}

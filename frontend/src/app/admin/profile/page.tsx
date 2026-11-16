import AdminProfileView from "@/components/admin/profile/AdminProfileView";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Admin Profile Settings — HireNest Admin",
  description: "Manage your administrator account information and profile picture.",
};

export default function AdminProfilePage() {
  return <AdminProfileView />;
}

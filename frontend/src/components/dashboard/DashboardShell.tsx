"use client";

import AppSidebar from "@/components/dashboard/AppSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { UserRole } from "@/types/auth";
import React from "react";

interface DashboardShellProps {
  role: UserRole;
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  role,
  children,
}) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900">
        {/* Left Fixed Sidebar (100dvh viewport height) */}
        <AppSidebar role={role} />

        {/* Right Content Area (Fixed Header + Independently Scrollable Main Area) */}
        <SidebarInset className="flex flex-1 flex-col h-screen overflow-hidden min-w-0 bg-slate-50">
          <DashboardHeader role={role} />
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardShell;


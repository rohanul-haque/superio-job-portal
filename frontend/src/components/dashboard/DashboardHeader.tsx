"use client";

import UserAvatar from "@/components/shared/UserAvatar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface DashboardHeaderProps {
  role: UserRole;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ role }) => {
  const { user } = useAuth();
  const pathname = usePathname();

  const getPageTitle = () => {
    // Admin routes
    if (pathname.includes("/admin/profile") || (pathname.includes("/profile") && role === "admin"))
      return "Admin Profile Settings";
    if (pathname.includes("/categories")) return "Category Management";
    if (pathname.includes("/candidates")) return "Candidate Moderation";
    if (pathname.includes("/recruiters")) return "Recruiter Moderation";
    if (pathname.includes("/jobs") && role === "admin") return "Master Jobs Directory";
    if (pathname.includes("/trash")) return "Trash & Restore Center";

    // Recruiter routes
    if (pathname.includes("/manage-jobs")) return "Manage Job Vacancies";
    if (pathname.includes("/add-job")) return "Published Job Vacancy";
    if (pathname.includes("/view-applicants")) return "Candidate Applications";
    if (pathname.includes("/company-profile")) return "Company Profile & Branding";

    // Candidate routes
    if (pathname.includes("/applied-jobs")) return "My Job Applications";
    if (pathname.includes("/saved-jobs")) return "Bookmarked Jobs";
    if (pathname.includes("/profile")) return "My Profile";

    // Common routes
    if (pathname.includes("/recommendations")) return "Smart Candidate Matching";

    return role === "admin"
      ? "Dashboard"
      : role === "recruiter"
        ? "Recruiter Overview"
        : "Candidate Overview";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Sidebar Trigger (Mobile only) & Page Title */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="lg:hidden" />
        <Separator orientation="vertical" className="h-5 mx-1 lg:hidden" />

        <div className="flex items-center gap-2.5">
          <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right: Live Portal Link / Back to Homepage & User Avatar */}
      <div className="flex items-center gap-3">
        {role === "admin" ? (
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition-colors duration-150 hover:text-blue-600 hover:underline shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-slate-500 transition-colors duration-150 group-hover:text-blue-600" />
            <span>Back to Home</span>
          </Link>
        ) : role === "recruiter" ? (
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition-colors duration-150 hover:text-blue-600 hover:underline shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-slate-500 transition-colors duration-150 group-hover:text-blue-600" />
            <span>Back to Home Page</span>
          </Link>
        ) : (
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition-colors duration-150 hover:text-blue-600 hover:underline shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-slate-500 transition-colors duration-150 group-hover:text-blue-600" />
            <span>Back to Home</span>
          </Link>
        )}

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-100">
          <UserAvatar
            user={user}
            className="h-8 w-8 rounded-full border border-slate-200"
            fallbackClassName={
              role === "admin"
                ? "bg-purple-100 text-purple-700 text-xs font-bold"
                : "bg-blue-100 text-blue-700 text-xs font-bold"
            }
          />

          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[140px]">
              {user?.name || (role === "admin" ? "Administrator" : "User")}
            </p>
            <span className="flex items-center gap-1 text-[10px] text-slate-500 leading-tight truncate max-w-[140px]">
              {user?.email || ""}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;


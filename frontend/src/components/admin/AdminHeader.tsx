"use client";

import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface AdminHeaderProps {
  onOpenSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenSidebar }) => {
  const { user } = useAuth();
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes("/categories")) return "Category Management";
    if (pathname.includes("/candidates")) return "Candidate Moderation";
    if (pathname.includes("/recruiters")) return "Recruiter Moderation";
    if (pathname.includes("/jobs")) return "Master Jobs Directory";
    if (pathname.includes("/trash")) return "Trash & Restore Center";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-8 backdrop-blur-md">
      {/* Mobile Menu Trigger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {getPageTitle()}
          </h1>
          <p className="hidden sm:block text-xs text-slate-400">
            System Administration & Control Center
          </p>
        </div>
      </div>

      {/* Right User State */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition-colors duration-150 hover:text-blue-600 hover:underline shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-slate-500 transition-colors duration-150 group-hover:text-blue-600" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold border border-slate-200">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[140px]">
              {user?.name || "Administrator"}
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

export default AdminHeader;


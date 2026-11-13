"use client";

import UserAvatar from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Menu, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface RecruiterHeaderProps {
  onToggleSidebar: () => void;
}

const pageTitles: { [key: string]: { title: string; subtitle: string } } = {
  "/recruiter/dashboard": {
    title: "Recruiter Dashboard",
    subtitle: "Real-time overview of your vacancies, applicants, and pipeline.",
  },
  "/recruiter/dashboard/manage-jobs": {
    title: "Manage Job Vacancies",
    subtitle: "Control public visibility, hiring status, and edit posted jobs.",
  },
  "/recruiter/dashboard/add-job": {
    title: "Published Job Vacancy",
    subtitle: "Publish a job opportunity to the Superio marketplace.",
  },
  "/recruiter/dashboard/view-applicants": {
    title: "Applicant Pipeline",
    subtitle: "Review incoming candidates, view PDF resumes, and update statuses.",
  },
  "/recruiter/dashboard/recommendations": {
    title: "AI Candidate Matching",
    subtitle: "Intelligent talent discovery matching skills to your requirements.",
  },
  "/recruiter/dashboard/company-profile": {
    title: "Company Profile",
    subtitle: "Manage company identity, logo, size, headquarters, and branding.",
  },
};

export const RecruiterHeader: React.FC<RecruiterHeaderProps> = ({
  onToggleSidebar,
}) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const currentMeta = pageTitles[pathname] || {
    title: "Recruiter Console",
    subtitle: "Manage your recruitment operations.",
  };

  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900">
            {currentMeta.title}
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/recruiter/dashboard/add-job">
          <Button
            size="sm"
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
          >
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Post New Job</span>
            <span className="sm:hidden">Post</span>
          </Button>
        </Link>

        <Link
          href="/recruiter/dashboard/company-profile"
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-slate-200 transition hover:ring-2 hover:ring-blue-400"
          title="Company Profile"
        >
          <UserAvatar
            user={user}
            className="h-9 w-9 rounded-xl"
            fallbackClassName="bg-blue-100 text-blue-700 font-bold rounded-xl text-xs"
          />
        </Link>
      </div>
    </header>
  );
};

export default RecruiterHeader;


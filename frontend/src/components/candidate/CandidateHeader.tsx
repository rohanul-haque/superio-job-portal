"use client";

import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/shared/UserAvatar";
import { useAuth } from "@/context/AuthContext";
import { Compass, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface CandidateHeaderProps {
  onToggleSidebar: () => void;
}

const pageTitles: { [key: string]: { title: string; subtitle: string } } = {
  "/candidate/dashboard": {
    title: "Candidate Dashboard",
    subtitle: "Real-time overview of your applications, metrics, and activity.",
  },
  "/candidate/dashboard/applied-jobs": {
    title: "Applied Jobs",
    subtitle: "Track, inspect, or withdraw your submitted job applications.",
  },
  "/candidate/dashboard/saved-jobs": {
    title: "Saved Bookmarks",
    subtitle: "Your collection of saved positions to review and apply.",
  },
  "/candidate/dashboard/recommendations": {
    title: "AI Job Recommendations",
    subtitle: "Personalized job matching powered by candidate skill alignment.",
  },
  "/candidate/dashboard/profile": {
    title: "Profile & Resume Management",
    subtitle: "Manage your professional profile, skills, and Cloudinary PDF resume.",
  },
};

export const CandidateHeader: React.FC<CandidateHeaderProps> = ({
  onToggleSidebar,
}) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const currentMeta = pageTitles[pathname] || {
    title: "Candidate Dashboard",
    subtitle: "Manage your career search and applications.",
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
        <Link href="/all-jobs">
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300"
          >
            <Compass className="mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Explore Openings</span>
            <span className="sm:hidden">Jobs</span>
          </Button>
        </Link>

        <Link
          href="/candidate/dashboard/profile"
          className="rounded-xl transition hover:ring-2 hover:ring-blue-400"
          title="Go to Profile"
        >
          <UserAvatar
            user={user}
            className="h-9 w-9 rounded-xl border border-slate-200"
            fallbackClassName="bg-blue-600 text-white font-bold text-xs uppercase rounded-xl"
          />
        </Link>
      </div>
    </header>
  );
};

export default CandidateHeader;


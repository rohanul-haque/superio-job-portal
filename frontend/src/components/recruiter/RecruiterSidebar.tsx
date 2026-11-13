"use client";

import UserAvatar from "@/components/shared/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Globe,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface RecruiterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/recruiter/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Manage Jobs",
    href: "/recruiter/dashboard/manage-jobs",
    icon: Briefcase,
    exact: false,
  },
  {
    label: "Post New Job",
    href: "/recruiter/dashboard/add-job",
    icon: PlusCircle,
    exact: false,
  },
  {
    label: "View Applicants",
    href: "/recruiter/dashboard/view-applicants",
    icon: Users,
    exact: false,
  },
  {
    label: "Candidate Matching",
    href: "/recruiter/dashboard/recommendations",
    icon: Sparkles,
    badge: "AI",
    exact: false,
  },
  {
    label: "Company Profile",
    href: "/recruiter/dashboard/company-profile",
    icon: Building2,
    exact: false,
  },
];

export const RecruiterSidebar: React.FC<RecruiterSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="flex h-18 items-center justify-between border-b border-slate-100 px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-lg shadow-sm shadow-indigo-500/30">
                S
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Superio<span className="text-indigo-600">.</span>
              </span>
            </Link>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Company Mini Card */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
              <div className="relative">
                <UserAvatar
                  user={user}
                  className="h-11 w-11 shrink-0 rounded-xl border border-slate-200"
                  fallbackClassName="bg-blue-100 text-blue-700 font-bold rounded-xl text-sm"
                />
                {user?.isEmailVerified && (
                  <div
                    className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white"
                    title="Verified Company"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs font-bold text-slate-900">
                    {user?.name}
                  </p>
                  {user?.isEmailVerified && (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  )}
                </div>
                <p className="truncate text-[11px] text-slate-500">
                  {user?.location || "Employer Portal"}
                </p>
                <div className="mt-1">
                  <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] px-1.5 py-0 font-medium">
                    Recruiter Console
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1.5">
            <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Recruitment
            </p>
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  data-active={isActive}
                  className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white font-bold shadow-none hover:bg-blue-600 hover:text-white data-[active=true]:bg-blue-600 data-[active=true]:text-white hover:[&>div>svg]:text-white hover:[&>div>span]:text-white"
                      : "text-slate-600 shadow-none hover:bg-blue-600 hover:text-white hover:[&>div>svg]:text-white hover:[&>div>span]:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-transform group-hover:scale-110 transition-colors duration-150 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-white"
                      }`}
                    />
                    <span
                      className={`transition-colors duration-150 ${
                        isActive
                          ? "text-white font-bold"
                          : "group-hover:text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase transition-colors ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-blue-50 text-blue-600 group-hover:bg-white/20 group-hover:text-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="border-t border-slate-100 p-4">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default RecruiterSidebar;

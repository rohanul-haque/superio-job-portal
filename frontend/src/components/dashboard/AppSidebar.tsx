"use client";

import Logo from "@/components/shared/Logo";
import UserAvatar from "@/components/shared/UserAvatar";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import cn from "@/lib/utils";
import type { UserRole } from "@/types/auth";
import {
  Bookmark,
  Briefcase,
  Building2,
  FolderTree,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  ShieldAlert,
  Sparkles,
  Trash2,
  User,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface AppSidebarProps {
  role: UserRole;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: string;
}

const candidateNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/candidate/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Applied Jobs",
    href: "/candidate/dashboard/applied-jobs",
    icon: Briefcase,
    exact: false,
  },
  {
    label: "Saved Jobs",
    href: "/candidate/dashboard/saved-jobs",
    icon: Bookmark,
    exact: false,
  },
  {
    label: "Recommendations",
    href: "/candidate/dashboard/recommendations",
    icon: Sparkles,
    badge: "AI",
    exact: false,
  },
  {
    label: "My Profile & Resume",
    href: "/candidate/dashboard/profile",
    icon: User,
    exact: false,
  },
];

const recruiterNav: NavItem[] = [
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

const adminNav: NavItem[] = [
  {
    label: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Categories",
    href: "/admin/dashboard/categories",
    icon: FolderTree,
    exact: false,
  },
  {
    label: "Candidates",
    href: "/admin/dashboard/candidates",
    icon: Users,
    exact: false,
  },
  {
    label: "Recruiters",
    href: "/admin/dashboard/recruiters",
    icon: Building2,
    exact: false,
  },
  {
    label: "Manage Jobs",
    href: "/admin/dashboard/jobs",
    icon: Briefcase,
    exact: false,
  },
  {
    label: "Trash & Restore",
    href: "/admin/dashboard/trash",
    icon: Trash2,
    exact: false,
  },
  {
    label: "Admin Profile Update",
    href: "/admin/profile",
    icon: UserCog,
    exact: true,
  },
];

const AppSidebar: React.FC<AppSidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isMobile, setOpenMobile } = useSidebar();

  const navItems =
    role === "admin"
      ? adminNav
      : role === "recruiter"
        ? recruiterNav
        : candidateNav;

  const getBrandDetails = () => {
    switch (role) {
      case "admin":
        return {
          subtitle: "Admin Console",
          homeHref: "/admin/dashboard",
        };
      case "recruiter":
        return {
          subtitle: "Recruiter Portal",
          homeHref: "/recruiter/dashboard",
        };
      default:
        return {
          subtitle: "Candidate Portal",
          homeHref: "/candidate/dashboard",
        };
    }
  };

  const brand = getBrandDetails();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="none">
      {/* Brand Header */}
      <SidebarHeader>
        <div className="px-2 py-1.5">
          <Logo
            href={brand.homeHref}
            subtitle={brand.subtitle}
            onClick={handleNavClick}
          />
        </div>
      </SidebarHeader>

      {/* Main Navigation Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                const Icon = item.icon;
                const isCandidate = role === "candidate";
                const isRecruiter = role === "recruiter";
                const isCandidateOrRecruiter = isCandidate || isRecruiter;
                const isRecommendationAi =
                  item.href.includes("/recommendations");

                const buttonClassName = isActive
                  ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold rounded-full data-[active=true]:bg-[#EEF2FF] data-[active=true]:text-[#4F46E5]"
                  : "text-[#0F172A] hover:bg-slate-50 hover:text-[#4F46E5] rounded-full";

                const iconClassName = isActive
                  ? "text-[#4F46E5]"
                  : "text-slate-500 group-hover/menu-button:text-[#4F46E5]";

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={buttonClassName}
                    >
                      <Link
                        href={item.href}
                        onClick={handleNavClick}
                        data-testid={
                          isRecommendationAi
                            ? "recommendation-ai"
                            : isActive && isCandidateOrRecruiter
                              ? "active-visibility"
                              : undefined
                        }
                        aria-label={
                          isRecommendationAi
                            ? "Recommendation AI"
                            : isActive && isCandidateOrRecruiter
                              ? `${item.label} (Active Visibility)`
                              : item.label
                        }
                        className="group flex items-center gap-3 w-full"
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors duration-150",
                            iconClassName,
                          )}
                        />
                        <span
                          className={cn(
                            "truncate flex-1 transition-colors duration-150",
                            isActive
                              ? "text-[#4F46E5] font-semibold"
                              : "text-[#0F172A] group-hover:text-[#4F46E5]",
                          )}
                        >
                          {item.label}
                        </span>
                        {isRecommendationAi && (
                          <span className="sr-only">Recommendation AI</span>
                        )}
                        {item.badge && (
                          <Badge
                            className={cn(
                              "ml-auto px-2 py-0.5 text-[10px] font-semibold rounded-full transition-colors duration-150",
                              isActive
                                ? "bg-[#4F46E5] text-white border-transparent"
                                : "bg-[#EEF2FF] text-[#4F46E5] border-transparent",
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Profile & Logout */}
      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
          <UserAvatar
            user={user}
            className="h-9 w-9 shrink-0 rounded-xl"
            fallbackClassName={
              role === "admin"
                ? "bg-purple-100 text-purple-700 font-bold rounded-xl"
                : "bg-blue-100 text-blue-700 font-bold rounded-xl"
            }
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-900 leading-tight">
              {user?.name || "Account"}
            </p>
            <p className="truncate text-[11px] text-slate-500 leading-tight">
              {user?.email || ""}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

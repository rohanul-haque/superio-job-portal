"use client";

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
import { cn } from "@/lib/utils";
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

export const AppSidebar: React.FC<AppSidebarProps> = ({ role }) => {
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
          title: "Superio",
          subtitle: "Admin Console",
          icon: ShieldAlert,
          color: "bg-purple-700 text-white shadow-purple-600/30",
          homeHref: "/admin/dashboard",
          badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "recruiter":
        return {
          title: "Superio",
          subtitle: "Recruiter Portal",
          icon: Building2,
          color: "bg-indigo-600 text-white shadow-indigo-500/30",
          homeHref: "/recruiter/dashboard",
          badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
        };
      default:
        return {
          title: "Superio",
          subtitle: "Candidate Portal",
          icon: Briefcase,
          color: "bg-blue-600 text-white shadow-blue-500/30",
          homeHref: "/candidate/dashboard",
          badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
        };
    }
  };

  const brand = getBrandDetails();
  const BrandIcon = brand.icon;

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="none">
      {/* Brand Header */}
      <SidebarHeader>
        <Link
          href={brand.homeHref}
          className="flex items-center gap-3 px-2 py-1.5 transition-opacity hover:opacity-90"
          onClick={handleNavClick}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold shadow-md ${brand.color}`}
          >
            <BrandIcon className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base font-black tracking-tight text-slate-900 leading-tight">
              {brand.title}
              <span className="text-blue-600">.</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
              {brand.subtitle}
            </span>
          </div>
        </Link>
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

                let buttonClassName = "";
                let iconClassName = "";

                if (isCandidateOrRecruiter) {
                  buttonClassName = isActive
                    ? "bg-blue-600 text-white font-bold shadow-none hover:bg-blue-600 hover:text-white data-[active=true]:bg-blue-600 data-[active=true]:text-white hover:[&>svg]:text-white data-[active=true]:[&>svg]:text-white hover:[&>span]:text-white data-[active=true]:[&>span]:text-white"
                    : "text-slate-600 shadow-none hover:bg-blue-600 hover:text-white hover:[&>svg]:text-white hover:[&>span]:text-white";

                  iconClassName = isActive
                    ? "text-white group-hover/menu-button:text-white group-hover:text-white"
                    : "text-slate-500 group-hover/menu-button:text-white group-hover:text-white";
                } else if (isActive) {
                  buttonClassName =
                    "bg-purple-50 text-purple-700 font-bold hover:bg-purple-100 hover:text-purple-800";
                  iconClassName = "text-purple-700";
                } else {
                  iconClassName =
                    "text-slate-500 group-hover/menu-button:text-slate-900 group-hover:text-slate-900";
                }

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
                            isCandidateOrRecruiter
                              ? isActive
                                ? "text-white font-bold group-hover/menu-button:text-white group-hover:text-white"
                                : "group-hover/menu-button:text-white group-hover:text-white"
                              : "",
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
                              "ml-auto px-1.5 py-0 text-[10px] font-bold transition-colors duration-150",
                              isCandidateOrRecruiter
                                ? isActive
                                  ? "bg-white/20 text-white border-transparent"
                                  : cn(
                                      brand.badgeColor,
                                      "group-hover/menu-button:bg-white/20 group-hover/menu-button:text-white group-hover/menu-button:border-transparent group-hover:bg-white/20 group-hover:text-white group-hover:border-transparent",
                                    )
                                : brand.badgeColor,
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

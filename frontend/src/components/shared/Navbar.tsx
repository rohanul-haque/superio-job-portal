"use client";

import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/Logo";
import UserAvatar from "@/components/shared/UserAvatar";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardUrl = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "recruiter") return "/recruiter/dashboard";
    return "/candidate/dashboard";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo href="/" />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-[#0F172A] transition-colors hover:text-[#4F46E5]"
          >
            Home
          </Link>
          <Link
            href="/all-jobs"
            className="text-sm font-medium text-[#0F172A] transition-colors hover:text-[#4F46E5]"
          >
            Find Jobs
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-[#0F172A] transition-colors hover:text-[#4F46E5]"
          >
            About Us
          </Link>
          <Link
            href="/terms"
            className="text-sm font-medium text-[#0F172A] transition-colors hover:text-[#4F46E5]"
          >
            Terms & FAQ
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative flex items-center gap-3">
              <Link href={getDashboardUrl()} className="hidden sm:inline-flex">
                <Button className="flex items-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5]">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white p-1.5 pr-3 text-left transition hover:bg-slate-50 cursor-pointer"
                >
                  <UserAvatar
                    user={user}
                    className="h-8 w-8 rounded-full border border-[#E5E7EB]"
                    fallbackClassName="bg-[#EEF2FF] text-[#4F46E5] font-bold text-xs uppercase"
                  />
                  <div className="hidden flex-col md:flex">
                    <span className="text-xs font-semibold text-[#0F172A] line-clamp-1 max-w-[120px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] capitalize text-slate-400">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#E5E7EB] bg-white py-2 shadow-sm z-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="border-b border-[#E5E7EB] px-4 py-2.5">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="truncate text-sm font-semibold text-[#0F172A]">
                        {user.email}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Verified {user.role}</span>
                      </div>
                    </div>

                    <Link
                      href={getDashboardUrl()}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#0F172A] transition hover:bg-slate-50"
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-400" />
                      Dashboard
                    </Link>

                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-[#DC2626] transition hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#0F172A] font-medium hover:text-[#4F46E5] hover:bg-[#EEF2FF]"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 md:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#4F46E5]"
            >
              Home
            </Link>
            <Link
              href="/all-jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#4F46E5]"
            >
              Find Jobs
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#4F46E5]"
            >
              About Us
            </Link>
            <Link
              href="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#4F46E5]"
            >
              Terms & FAQ
            </Link>
            {isAuthenticated && user && (
              <Link
                href={getDashboardUrl()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700"
              >
                <LayoutDashboard className="h-4 w-4" />
                Go to {user.role} Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

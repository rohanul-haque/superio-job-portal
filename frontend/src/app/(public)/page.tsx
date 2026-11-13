"use client";

import GetStartedModal from "@/components/auth/GetStartedModal";
import CategoryGrid from "@/components/home/CategoryGrid";
import HeroSearch from "@/components/home/HeroSearch";
import Testimonials from "@/components/home/Testimonials";
import JobCard from "@/components/jobs/JobCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import categoryService from "@/services/category.service";
import jobService from "@/services/job.service";
import type { ICategory } from "@/types/category";
import type { IJob } from "@/types/job";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Download,
  Layers,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const PARTNER_COMPANIES = [
  "Google",
  "Microsoft",
  "Amazon",
  "Spotify",
  "Airbnb",
  "Stripe",
];

export default function HomePage() {
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await categoryService.getAllCategories({
          isActive: "true",
        });
        setCategories(catRes || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }

      try {
        const jobRes = await jobService.getAllJobs({
          limit: 6,
          sortBy: "newest",
          hiringStatus: "Ongoing",
        });
        setJobs(jobRes.jobs || []);
      } catch (err) {
        console.error("Failed to fetch latest jobs:", err);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-20 py-10 md:py-16">
      {/* Role Selection Get Started Modal */}
      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <Badge
          variant="secondary"
          className="mb-4 gap-1.5 px-3.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Enterprise Edition v2.0 Live
        </Badge>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Modern Recruitment Platform <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
            Built for High-Growth Teams
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
          Superio connects ambitious talent with world-class employers. Featuring
          enterprise Gmail verification, dynamic category management, and
          server-side job discovery.
        </p>

        {/* Hero Search Bar */}
        <div className="mt-10">
          <HeroSearch />
        </div>

        {/* Partner Logos */}
        <div className="mt-14 border-t border-slate-100 pt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Trusted by hiring leaders at top organizations
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
            {PARTNER_COMPANIES.map((company) => (
              <span
                key={company}
                className="text-lg sm:text-xl font-bold tracking-tight text-slate-700"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Job Categories Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Explore by Industry
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Popular Job Categories
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Discover opportunities across Admin-curated career categories
            </p>
          </div>
          <Link href="/all-jobs">
            <Button
              variant="outline"
              className="text-xs font-semibold border-slate-300 hover:border-blue-600 hover:text-blue-600"
            >
              All Categories →
            </Button>
          </Link>
        </div>

        <CategoryGrid
          categories={categories}
          isLoading={isLoadingCategories}
        />
      </section>

      {/* Latest 6 Job Posts Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Fresh Openings
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Latest Featured Jobs
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Verified active opportunities published recently
            </p>
          </div>
          <Link href="/all-jobs">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
              Browse All Jobs
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {isLoadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-60 animate-pulse rounded-2xl border border-slate-100 bg-slate-50 p-6"
              />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-slate-50/50">
            <Briefcase className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-base font-bold text-slate-800">
              No jobs currently published
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Recruiters can publish new job vacancies from the Recruiter
              Dashboard.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Link href="/all-jobs">
                <Button variant="outline" size="sm">
                  View All Openings
                </Button>
              </Link>
              <Link href="/register?role=recruiter">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Post a Job as Employer
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Role Portals Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10 max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Role-Based Workflows
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Dedicated Workflows for Every Role
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Access tailored dashboards designed specifically for your recruitment needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Candidate Card */}
          <Card className="border border-slate-200 transition-all hover:shadow-lg hover:border-blue-300 flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">Candidates</CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Find jobs, upload your resume, submit applications, and track your interview pipeline.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  Mandatory Email Verification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  Application Activity Area Chart
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  PDF Resume & Skill Management
                </li>
              </ul>
              <div className="flex gap-2 pt-2">
                <Link href="/login?role=candidate" className="flex-1">
                  <Button variant="outline" className="w-full text-xs">
                    Candidate Login
                  </Button>
                </Link>
                <Link href="/register?role=candidate" className="flex-1">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-xs">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recruiter Card */}
          <Card className="border border-slate-200 transition-all hover:shadow-lg hover:border-amber-300 flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Building2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">
                Recruiters & Companies
              </CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Publish openings, screen candidates, review resumes, and manage hiring decisions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  Employer Company Profile
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  Incoming Applicant Inflow Chart
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  Applicant Status Mutations
                </li>
              </ul>
              <div className="flex gap-2 pt-2">
                <Link href="/login?role=recruiter" className="flex-1">
                  <Button variant="outline" className="w-full text-xs">
                    Recruiter Login
                  </Button>
                </Link>
                <Link href="/register?role=recruiter" className="flex-1">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs">
                    Register Company
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Admin / Governance Card */}
          <Card className="border border-slate-200 transition-all hover:shadow-lg hover:border-purple-300 flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">
                System Administration
              </CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Govern platform taxonomy, moderate accounts, manage categories, and handle trash recovery.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                  Dynamic Category CRUD
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                  Non-Destructive Soft-Delete Trash
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                  Candidate & Recruiter Moderation
                </li>
              </ul>
              <div className="pt-2">
                <Link href="/admin/dashboard" className="w-full">
                  <Button variant="secondary" className="w-full text-xs">
                    Admin Portal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials & Counter Statistics Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <Testimonials />
      </section>

      {/* Mobile App Promotional Download Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-0 mb-4 text-xs font-semibold">
              <Smartphone className="mr-1.5 h-3.5 w-3.5" />
              Mobile App Experience
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Take Your Career Search Anywhere
            </h2>
            <p className="mt-3 text-blue-100 text-sm sm:text-base leading-relaxed">
              Receive real-time push notifications when employers review your
              resume, schedule interviews, and accept applications. Available on
              iOS and Android.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs sm:text-sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Download for iOS
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-semibold text-xs sm:text-sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Download for Android
              </Button>
            </div>
          </div>

          {/* Background decorative circles */}
          <div className="absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute right-40 top-0 h-40 w-40 rounded-full bg-indigo-400/20 blur-xl" />
        </div>
      </section>
    </div>
  );
}

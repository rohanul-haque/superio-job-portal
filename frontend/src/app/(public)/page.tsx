"use client";

import GetStartedModal from "@/components/auth/GetStartedModal";
import CategoryGrid from "@/components/home/CategoryGrid";
import GetHiredSteps from "@/components/home/GetHiredSteps";
import HeroSearch from "@/components/home/HeroSearch";
import Testimonials from "@/components/home/Testimonials";
import TrustedByCarousel from "@/components/home/TrustedByCarousel";
import JobCard from "@/components/jobs/JobCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import categoryService from "@/services/category.service";
import jobService from "@/services/job.service";
import type { ICategory } from "@/types/category";
import type { IJob } from "@/types/job";
import {
  ArrowRight,
  Briefcase,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
          Superio connects ambitious talent with world-class employers.
          Featuring enterprise Gmail verification, dynamic category management,
          and server-side job discovery.
        </p>

        {/* Hero Search Bar */}
        <div className="mt-10">
          <HeroSearch />
        </div>

        {/* Brand Logo Section – Trust by Hiring Leaders and Top Organizations */}
        <TrustedByCarousel />
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

        <CategoryGrid categories={categories} isLoading={isLoadingCategories} />
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

      {/* Get Hired in 4 Quick Easy Steps */}
      <GetHiredSteps />

      {/* Testimonials & Counter Statistics Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <Testimonials />
      </section>

      {/* Call to Action (CTA) Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-12 sm:px-12 sm:py-16 md:py-20 text-white shadow-xl">
          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            <Badge className="bg-white/20 text-white border-0 mb-4 px-3.5 py-1 text-xs font-semibold backdrop-blur-xs inline-flex items-center gap-1.5 shadow-none">
              <Sparkles className="h-3.5 w-3.5" />
              Join High-Growth Careers
            </Badge>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to Accelerate Your Career or Build Your Dream Team?
            </h2>

            <p className="mt-4 text-blue-100 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
              Connect with leading organizations, discover verified global
              opportunities, and hire top-tier talent with Superio&apos;s
              enterprise recruitment ecosystem.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Button
                onClick={() => setIsGetStartedOpen(true)}
                size="lg"
                className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 bg-white text-blue-700 hover:bg-slate-50 font-semibold text-sm sm:text-base rounded-xl shadow-none"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Link href="/all-jobs" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 bg-transparent hover:bg-transparent text-white hover:text-white border-white/80 hover:border-white/80 font-semibold text-sm sm:text-base rounded-xl shadow-none"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Explore All Opening Jobs
                </Button>
              </Link>
            </div>
          </div>

          {/* Background decorative elements */}
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute right-40 top-0 h-40 w-40 rounded-full bg-indigo-400/20 blur-2xl" />
          <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-blue-400/20 blur-2xl" />
        </div>
      </section>
    </div>
  );
}

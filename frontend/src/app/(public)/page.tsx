"use client";

import GetStartedModal from "@/components/auth/GetStartedModal";
import CategoryGrid from "@/components/home/CategoryGrid";
import GetHiredSteps from "@/components/home/GetHiredSteps";
import HeroSearch from "@/components/home/HeroSearch";
import Testimonials from "@/components/home/Testimonials";
import TrustedByCarousel from "@/components/home/TrustedByCarousel";
import JobCard from "@/components/jobs/JobCard";
import { JobCardSkeleton } from "@/components/shared/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import categoryService from "@/services/category.service";
import jobService from "@/services/job.service";
import type { ICategory } from "@/types/category";
import type { IJob } from "@/types/job";
import { ArrowRight, Briefcase, Sparkles } from "lucide-react";
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
        // Sort by latest created categories first and take exactly 8
        const sorted = [...(catRes || [])].sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });
        setCategories(sorted.slice(0, 8));
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
    <div className="flex flex-col gap-16 md:gap-20 py-8 sm:py-12 md:py-16">
      {/* Role Selection Get Started Modal */}
      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 w-full">
        <Badge
          variant="secondary"
          className="mb-4 gap-1.5 px-3.5 py-1 text-xs font-medium text-[#4F46E5] bg-[#EEF2FF] border-0 rounded-full"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Smart Job Discovery & Hiring Platform
        </Badge>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
          Modern Recruitment Platform <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#4338CA] bg-clip-text text-transparent">
            Built for High-Growth Teams
          </span>
        </h1>

        <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed px-2">
          Hirenest connects ambitious talent with world-class employers.
          Featuring verified candidate profiles, intelligent job matching,
          and server-side career discovery.
        </p>

        {/* Hero Search Bar */}
        <div className="mt-8 sm:mt-10">
          <HeroSearch />
        </div>

        {/* Brand Logo Section – Trust by Hiring Leaders and Top Organizations */}
        <TrustedByCarousel />
      </section>

      {/* Job Popular Categories Section (Placed directly above Latest Job Posts) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
          <span className="text-xs font-medium uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-3.5 py-1 rounded-full">
            Explore by Industry
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Popular Job Categories
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Discover opportunities across Admin-curated career categories
          </p>
        </div>

        <CategoryGrid categories={categories} isLoading={isLoadingCategories} />
      </section>

      {/* Latest Job Posts Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
          <span className="text-xs font-medium uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-3.5 py-1 rounded-full">
            Latest Openings
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Latest Job Posts
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Verified active opportunities published recently
          </p>
        </div>

        {isLoadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Center-aligned Browse All Jobs button below job cards */}
            <div className="mt-10 sm:mt-12 flex justify-center">
              <Link href="/all-jobs">
                <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs sm:text-sm font-medium rounded-full h-11 px-8 shadow-none cursor-pointer">
                  Browse All Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E5E7EB] p-12 text-center bg-slate-50/50">
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
                <Button variant="outline" size="sm" className="rounded-full">
                  View All Openings
                </Button>
              </Link>
              <Link href="/register?role=recruiter">
                <Button
                  size="sm"
                  className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-full"
                >
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#4338CA] px-6 py-12 sm:px-12 sm:py-16 md:py-20 text-white shadow-none">
          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            <Badge className="bg-white/20 text-white border-0 mb-4 px-3.5 py-1 text-xs font-medium backdrop-blur-xs inline-flex items-center gap-1.5 shadow-none rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              Join High-Growth Careers
            </Badge>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to Accelerate Your Career or Build Your Dream Team?
            </h2>

            <p className="mt-4 text-indigo-100 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
              Connect with leading organizations, discover verified global
              opportunities, and hire top-tier talent with Hirenest&apos;s
              recruitment ecosystem.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Button
                onClick={() => setIsGetStartedOpen(true)}
                size="lg"
                className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 bg-white text-[#4F46E5] hover:bg-slate-50 font-medium text-sm sm:text-base rounded-full shadow-none"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Link href="/all-jobs" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 bg-transparent hover:bg-transparent text-white hover:text-white border-white/80 hover:border-white/80 font-medium text-sm sm:text-base rounded-full shadow-none"
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

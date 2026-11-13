import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "About Us — Superio Job Portal Enterprise",
  description:
    "Learn about Superio Enterprise recruitment ecosystem connecting candidates, employers, and administrators globally.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-3 py-1"
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          Enterprise Recruitment Infrastructure
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Bridging the Gap Between World-Class Talent and Visionary Companies
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Superio Job Portal Enterprise Edition is an industry-leading recruitment
          platform architected for reliable candidate discovery, dynamic taxonomy
          administration, and enterprise data governance.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Verified Identity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every candidate and recruiter account undergoes mandatory Gmail
            verification to ensure authenticity and reduce spam across job pipelines.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Briefcase className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Dynamic Taxonomy</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            System Administrators curate real-time job categories with live job
            counts, ensuring candidates discover relevant vacancies effortlessly.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Globe2 className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Non-Destructive Governance</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Strict soft-delete standards guarantee records can be reviewed,
            moderated, and safely restored through centralized admin trash recovery.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-center text-white space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Ready to Start Your Hiring Journey?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Whether you are looking for your next career move or searching for elite
          talent to scale your engineering team, Superio is built for you.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/all-jobs">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm">
              Explore Open Jobs
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="text-white border-slate-700 hover:bg-slate-800 text-xs sm:text-sm">
              Create an Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


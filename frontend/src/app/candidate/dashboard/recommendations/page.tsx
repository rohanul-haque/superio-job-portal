"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BrainCircuit,
  Compass,
  Cpu,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function CandidateRecommendationsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="border-slate-200 shadow-xs overflow-hidden">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-8 sm:p-12 text-white">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-blue-300 animate-pulse" />
              Machine Learning & Vector Search
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-white">
              AI-Powered Job Recommendation
            </h1>

            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              We are training smart embedding models that analyze your skill tags, resume keywords, and career trajectory to match you with higher-probability offers.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge className="bg-white/10 text-white border-white/20 text-xs px-2.5 py-1">
                Coming in v2.1
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs px-2.5 py-1">
                In Active Development
              </Badge>
            </div>
          </div>
        </div>

        <CardContent className="p-6 sm:p-8">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            What You Can Expect
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-3">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">
                Semantic Skill Matching
              </h4>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                Matches vacancies based on conceptual proficiency rather than literal keyword matches.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-3">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">
                Fit Probability Scoring
              </h4>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                Provides a confidence score for each opening so you apply where your chances are highest.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600 mb-3">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">
                Salary Benchmark Insights
              </h4>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                Compares company compensation offers with industry standard median salaries.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs text-slate-500">
              In the meantime, explore all active openings using our server-side filter engine.
            </p>
            <Link href="/all-jobs">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs text-white">
                <Compass className="mr-1.5 h-3.5 w-3.5" />
                Browse Catalogue
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  FileCheck2,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function RecruiterRecommendationsPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotifyMe = () => {
    setIsSubscribed(true);
    toast.success("Notification Preference Saved", {
      description: "You'll be the first to receive early access to AI Candidate Matching!",
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-semibold gap-1.5 py-1 px-3">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            AI Intelligence Suite
          </Badge>
          <Badge variant="outline" className="text-slate-500 text-xs">
            Roadmap Preview
          </Badge>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          AI Smart Candidate Matching
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Automated semantic profile-to-job matching, candidate suitability scoring, and intelligent resume insight generation.
        </p>
      </div>

      {/* Hero Teaser Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-linear-to-br from-indigo-900 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white shadow-xl">
        {/* Decorative background glows */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3.5 py-1 text-xs font-medium text-indigo-200 backdrop-blur-md">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            Coming Soon to Superio Enterprise
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Stop sifting through hundreds of resumes manually.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Our next-generation AI engine evaluates applicants against your job specifications, analyzing work history, verifiable skills, and semantic relevance to rank the best candidates in seconds.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Button
              onClick={handleNotifyMe}
              disabled={isSubscribed}
              className="gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
            >
              {isSubscribed ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  You&apos;re on the Early Access List
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Notify Me When Live
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Upcoming Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-xs hover:border-indigo-200 transition-colors">
          <CardContent className="p-6 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Semantic Compatibility Score
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every applicant receives a real-time 0–100% suitability index calculated from actual experience, tech stacks, and domain expertise.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs hover:border-indigo-200 transition-colors">
          <CardContent className="p-6 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Automated Resume Highlights
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              AI highlights key accomplishments, verified certifications, and potential role gaps directly on the candidate profile preview.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs hover:border-indigo-200 transition-colors">
          <CardContent className="p-6 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Candidate Pool Recommendations
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get proactive suggestions of top passive candidates across the Superio network matching your newly posted vacancies.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Mockup Preview */}
      <Card className="border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Preview Interface Mockup
            </span>
          </div>
          <Badge className="bg-indigo-100 text-indigo-700 border-0 text-[11px] font-semibold">
            Interactive UI Demo
          </Badge>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold text-lg">
                98%
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900">Sarah Jenkins</h4>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    Strong Match
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Senior Full-Stack Engineer • 6 yrs exp • San Francisco, CA
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    TypeScript
                  </span>
                  <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    Next.js
                  </span>
                  <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    Node.js
                  </span>
                  <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    PostgreSQL
                  </span>
                </div>
              </div>
            </div>

            <div className="self-end sm:self-center">
              <Button
                size="sm"
                variant="outline"
                disabled
                className="gap-1.5 text-xs font-bold border-indigo-200 text-indigo-700 bg-white"
              >
                Inspect Match Analysis
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import { Badge } from "@/components/ui/badge";
import { motion, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useEffect } from "react";

const PILLARS = [
  {
    icon: <ShieldCheck className="h-6 w-6 stroke-[2.2]" />,
    iconBg: "bg-[#EEF2FF]",
    iconColor: "text-[#4F46E5]",
    title: "Verified Identity",
    description:
      "Every candidate and recruiter account undergoes mandatory Gmail verification to ensure authenticity and eliminate spam across recruitment pipelines.",
  },
  {
    icon: <Briefcase className="h-6 w-6 stroke-[2.2]" />,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    title: "Dynamic Taxonomy",
    description:
      "System Administrators curate real-time job categories with live job counts, ensuring candidates discover relevant career vacancies effortlessly.",
  },
  {
    icon: <Globe2 className="h-6 w-6 stroke-[2.2]" />,
    iconBg: "bg-[#F5F3FF]",
    iconColor: "text-[#6366F1]",
    title: "Non-Destructive Governance",
    description:
      "Strict soft-delete standards guarantee records can be reviewed, moderated, and safely restored through centralized admin trash recovery.",
  },
];

const STATS = [
  {
    icon: <Users className="h-6 w-6 stroke-[2.2]" />,
    value: "25,000+",
    label: "Active Job Seekers",
    subtext: "Verified candidate profiles",
    iconBg: "bg-[#EEF2FF]",
    iconColor: "text-[#4F46E5]",
  },
  {
    icon: <Building2 className="h-6 w-6 stroke-[2.2]" />,
    value: "1,200+",
    label: "Verified Companies",
    subtext: "Hiring global talent",
    iconBg: "bg-[#F5F3FF]",
    iconColor: "text-[#6366F1]",
  },
  {
    icon: <TrendingUp className="h-6 w-6 stroke-[2.2]" />,
    value: "8,500+",
    label: "Active Vacancies",
    subtext: "Updated daily in real time",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: <CheckCircle2 className="h-6 w-6 stroke-[2.2]" />,
    value: "98.4%",
    label: "Placement Rate",
    subtext: "Within 30 days of applying",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export default function AboutClient() {
  const shouldReduceMotion = useReducedMotion();

  // Smooth scroll behavior exclusively for this page
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="flex flex-col gap-16 md:gap-20 py-10 md:py-16">
      {/* Hero Header */}
      <section className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={
            shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          <Badge
            variant="secondary"
            className="mb-4 gap-1.5 px-3.5 py-1 text-xs font-medium text-[#4F46E5] bg-[#EEF2FF] border-0 rounded-full"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Modern Recruitment Platform
          </Badge>
        </motion.div>

        <motion.h1
          initial={
            shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.08,
            ease: [0.25, 0.1, 0.25, 1.0],
          }}
          className="text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl"
        >
          Connecting Top Talent with <br />
          <span className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#4338CA] bg-clip-text text-transparent">
            Visionary Companies
          </span>
        </motion.h1>

        <motion.p
          initial={
            shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.16,
            ease: [0.25, 0.1, 0.25, 1.0],
          }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
        >
          Hirenest is a modern recruitment platform architected for reliable
          candidate discovery, dynamic category administration, and verified
          professional hiring.
        </motion.p>
      </section>

      {/* Core Pillars / Values Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={
            shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="text-center mb-10 max-w-2xl mx-auto"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-3.5 py-1 rounded-full">
            Our Foundation
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Engineered for Transparency & Trust
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Guiding principles that power the Hirenest recruitment ecosystem
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={i}
              initial={
                shouldReduceMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 24 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.45,
                delay: shouldReduceMotion ? 0 : i * 0.1,
                ease: [0.25, 0.1, 0.25, 1.0],
              }}
              className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-[#E5E7EB] shadow-none hover:border-[#4F46E5] transition-all duration-300 flex flex-col justify-start text-left"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${pillar.iconBg} ${pillar.iconColor} mb-5 group-hover:scale-105 transition-transform duration-300`}
              >
                {pillar.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-2.5 tracking-tight group-hover:text-[#4F46E5] transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={
                shouldReduceMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 24 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.45,
                delay: shouldReduceMotion ? 0 : i * 0.08,
                ease: [0.25, 0.1, 0.25, 1.0],
              }}
              className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-[#E5E7EB] shadow-none hover:border-[#4F46E5] transition-all duration-300 flex flex-col justify-start text-left"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.iconBg} ${stat.iconColor} mb-5 group-hover:scale-105 transition-transform duration-300`}
              >
                {stat.icon}
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                {stat.value}
              </span>
              <span className="mt-2 text-base font-bold text-[#0F172A] tracking-tight group-hover:text-[#4F46E5] transition-colors">
                {stat.label}
              </span>
              <span className="mt-1 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                {stat.subtext}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

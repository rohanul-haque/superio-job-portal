"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  CheckCircle,
  Quote,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import React from "react";

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
    icon: <CheckCircle className="h-6 w-6 stroke-[2.2]" />,
    value: "98.4%",
    label: "Successful Placement",
    subtext: "Within 30 days of applying",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Hirenest completely streamlined our tech hiring. The verified email requirement and candidate PDF resume preview helped us filter out bots and hire 3 senior engineers in record time.",
    name: "Sarah Jenkins",
    role: "VP of People at CloudScale",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote:
      "The zero-token email verification and dynamic role dashboard made finding and applying to remote developer positions effortless. I received 4 interview requests within a week!",
    name: "Alex Rivera",
    role: "Lead Full-Stack Developer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote:
      "The role-based access control and live applicant inflow charts provide our recruitment team with unmatched clarity. We couldn't imagine hiring without Hirenest.",
    name: "Marcus Vance",
    role: "Head of Talent Acquisition at Apex Labs",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    rating: 5,
  },
];

export const Testimonials: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="space-y-16">
      {/* Counters Grid */}
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

      {/* Testimonials Grid */}
      <div>
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.5,
            ease: [0.25, 0.1, 0.25, 1.0],
          }}
          className="text-center max-w-xl mx-auto mb-10"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-3.5 py-1 rounded-full">
            Trusted Worldwide
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A]">
            Loved by Candidates and Recruiters
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Here is what high-growth companies and job seekers have to say about
            Hirenest.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
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
                duration: shouldReduceMotion ? 0 : 0.5,
                delay: shouldReduceMotion ? 0 : i * 0.12,
                ease: [0.25, 0.1, 0.25, 1.0],
              }}
              className="flex flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-none transition hover:border-[#4F46E5]"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="h-6 w-6 text-indigo-200 mb-2" />
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-[#E5E7EB] pt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">{t.name}</h4>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

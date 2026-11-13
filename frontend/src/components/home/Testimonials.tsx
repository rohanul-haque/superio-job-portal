"use client";

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
    icon: <Users className="h-6 w-6 text-blue-600" />,
    value: "25,000+",
    label: "Active Job Seekers",
    subtext: "Verified candidate profiles",
  },
  {
    icon: <Building2 className="h-6 w-6 text-indigo-600" />,
    value: "1,200+",
    label: "Verified Companies",
    subtext: "Hiring global talent",
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
    value: "8,500+",
    label: "Active Vacancies",
    subtext: "Updated daily in real time",
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-amber-600" />,
    value: "98.4%",
    label: "Successful Placement",
    subtext: "Within 30 days of applying",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Superio completely streamlined our tech hiring. The verified email requirement and candidate PDF resume preview helped us filter out bots and hire 3 senior engineers in record time.",
    name: "Sarah Jenkins",
    role: "VP of People at CloudScale",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote:
      "The zero-token email verification and dynamic role dashboard made finding and applying to remote developer positions effortless. I received 4 interview requests within a week!",
    name: "Alex Rivera",
    role: "Lead Full-Stack Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote:
      "The role-based access control and live applicant inflow charts provide our recruitment team with unmatched clarity. We couldn't imagine hiring without Superio Enterprise.",
    name: "Marcus Vance",
    role: "Head of Talent Acquisition at Apex Labs",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    rating: 5,
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="space-y-16">
      {/* Counters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-6 text-center shadow-xs"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 mb-3">
              {stat.icon}
            </div>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stat.value}
            </span>
            <span className="mt-1 text-sm font-semibold text-slate-700">
              {stat.label}
            </span>
            <span className="text-xs text-slate-400 mt-0.5">{stat.subtext}</span>
          </div>
        ))}
      </div>

      {/* Testimonials Grid */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Trusted Worldwide
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Loved by Candidates and Recruiters
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Here is what high-growth companies and job seekers have to say about Superio Enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="h-6 w-6 text-blue-200 mb-2" />
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;


"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  FileText,
  HelpCircle,
  Lock,
  RotateCcw,
  Scale,
  Shield,
  Sparkles,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const FAQS = [
  {
    q: "How does mandatory email verification work on Hirenest?",
    a: "When you sign up as a Candidate or Recruiter, our backend generates an email verification session dispatched via verified Gmail SMTP. Clicking the verification link or completing verification from the registration browser immediately activates your account with zero delays.",
  },
  {
    q: "Why is a PDF resume required before applying for a job?",
    a: "Employers require candidates to have a valid PDF resume uploaded to their profile. This ensures recruiters can properly inspect your credentials via the embedded PDF viewer without back-and-forth communication or email attachments.",
  },
  {
    q: "Can recruiters post jobs without an active company profile?",
    a: "No. Recruiters must verify their account and configure their company profile (including name, location, and website) to publish vacancies. Jobs posted without complete company profiles are held from public visibility until verified.",
  },
  {
    q: "What is Hirenest's Soft-Delete policy?",
    a: "No records (users, companies, jobs, or categories) are ever permanently destroyed. Items are marked as soft-deleted (isDeleted: true) and can be recovered by an Administrator at any time in the centralized Admin Trash Center.",
  },
  {
    q: "Are job postings screened before appearing in the catalogue?",
    a: "Yes. Administrators have platform-wide moderation controls to ensure job listings comply with local employment standards and maintain accurate salary, location, and vacancy specifications.",
  },
];

const TERMS_SECTIONS = [
  {
    icon: <UserCheck className="h-5 w-5 text-[#4F46E5]" />,
    title: "1. Account Authenticity & Registration",
    content:
      "All users agree to supply accurate, non-fraudulent identification details. Impersonation of companies, recruiters, or job seekers will result in immediate and permanent account suspension. Every account must complete email verification before accessing platform privileges.",
  },
  {
    icon: <Lock className="h-5 w-5 text-[#6366F1]" />,
    title: "2. Data Privacy & Candidate Credentials",
    content:
      "Resumes and applicant profiles are strictly shared only with companies to which the candidate explicitly submits an application. Hirenest never sells, rents, or distributes candidate contact details or resumes to third-party data brokers.",
  },
  {
    icon: <Briefcase className="h-5 w-5 text-emerald-600" />,
    title: "3. Fair Recruitment & Employer Standards",
    content:
      "Recruiters must post genuine, active job vacancies with transparent compensation expectations. Spamming listings, duplicate submissions, or requesting unauthorized recruitment fees from candidates is strictly prohibited and subject to immediate administrative moderation.",
  },
  {
    icon: <RotateCcw className="h-5 w-5 text-amber-600" />,
    title: "4. Non-Destructive Data Governance",
    content:
      "To protect user rights, compliance logs, and transactional integrity, Hirenest employs a non-destructive soft-delete policy. Deleted items can be reviewed, audited, and restored by system administrators to prevent accidental data loss.",
  },
  {
    icon: <Scale className="h-5 w-5 text-purple-600" />,
    title: "5. Platform Moderation & Enforcement",
    content:
      "Hirenest administrators maintain continuous oversight across categories, recruiter profiles, and job listings. Listings that violate equal employment opportunity regulations or contain misleading claims will be unlisted or flagged for revision.",
  },
];

export default function TermsPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-16 md:gap-20 py-10 md:py-16">
      {/* Hero Header */}
      <section className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Badge
          variant="secondary"
          className="mb-4 gap-1.5 px-3.5 py-1 text-xs font-medium text-[#4F46E5] bg-[#EEF2FF] border-0 rounded-full"
        >
          <Shield className="h-3.5 w-3.5" />
          Policies & Transparency
        </Badge>

        <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl">
          Platform Terms & <br />
          <span className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#4338CA] bg-clip-text text-transparent">
            Frequently Asked Questions
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Everything you need to know about candidate privacy, recruiter verification, platform governance, and operating guidelines on Hirenest.
        </p>
      </section>

      {/* FAQ Accordion Section */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <span className="text-xs font-medium uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-3.5 py-1 rounded-full">
            Quick Answers
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Answers to common questions about candidate verification and recruitment workflows
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 bg-white ${
                  isOpen
                    ? "border-[#4F46E5] shadow-none"
                    : "border-[#E5E7EB] hover:border-slate-300 shadow-none"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isOpen
                          ? "bg-[#4F46E5] text-white"
                          : "bg-[#EEF2FF] text-[#4F46E5]"
                      }`}
                    >
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <span className="text-base sm:text-lg font-bold text-[#0F172A]">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#4F46E5]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 pt-0 sm:px-6 sm:pb-7">
                    <div className="border-t border-slate-100 pt-4 pl-[54px]">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Terms & Conditions Section */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <span className="text-xs font-medium uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-3.5 py-1 rounded-full">
            Legal & Compliance
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Platform Terms of Service
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Rules, obligations, and standards for candidates, recruiters, and employers
          </p>
        </div>

        <div className="space-y-4">
          {TERMS_SECTIONS.map((section, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-[#E5E7EB] shadow-none hover:border-[#4F46E5] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-[#E5E7EB]">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-2 group-hover:text-[#4F46E5] transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action (CTA) Section matching Homepage */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#4338CA] px-6 py-12 sm:px-12 sm:py-16 md:py-20 text-white shadow-none">
          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            <Badge className="bg-white/20 text-white border-0 mb-4 px-3.5 py-1 text-xs font-medium backdrop-blur-xs inline-flex items-center gap-1.5 shadow-none rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              Need Assistance?
            </Badge>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Have More Questions or Need Support?
            </h2>

            <p className="mt-4 text-indigo-100 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
              Our team is dedicated to supporting your recruitment and career growth. Join thousands of satisfied candidates and employers today.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link href="/all-jobs" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 bg-white text-[#4F46E5] hover:bg-slate-50 font-medium text-sm sm:text-base rounded-full shadow-none"
                >
                  Explore Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 bg-transparent hover:bg-transparent text-white hover:text-white border-white/80 hover:border-white/80 font-medium text-sm sm:text-base rounded-full shadow-none"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Get Started Free
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

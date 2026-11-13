import { Badge } from "@/components/ui/badge";
import { HelpCircle, Shield, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Terms & FAQ — Superio Job Portal Enterprise",
  description:
    "Review Terms of Service, data privacy guidelines, candidate requirements, and frequently asked questions on Superio Enterprise.",
};

const FAQS = [
  {
    q: "How does mandatory email verification work on Superio?",
    a: "When you sign up as a Candidate or Recruiter, our backend generates an email verification session dispatched via Gmail SMTP. Clicking the verification link or completing verification from the registration browser immediately activates your account.",
  },
  {
    q: "Why is a PDF resume required before applying for a job?",
    a: "Under Enterprise Specification Rule 3.4, employers require candidates to have a valid PDF resume uploaded to their profile. This ensures recruiters can properly review your credentials without back-and-forth delays.",
  },
  {
    q: "Can recruiters post jobs without an active company profile?",
    a: "No. Recruiters must verify their account and configure their company profile (name, location, website) to publish vacancies. Jobs posted without complete company profiles are held from public visibility.",
  },
  {
    q: "What is Superio's Soft-Delete policy?",
    a: "No records (users, companies, jobs, or categories) are ever permanently destroyed. Items are marked as soft-deleted (`isDeleted: true`) and can be recovered by an Administrator in the Admin Trash Center.",
  },
  {
    q: "Are job postings screened before appearing in the catalogue?",
    a: "Yes. Administrators have platform-wide moderation controls to ensure job listings comply with local employment standards and maintain accurate salary and vacancy information.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-3 py-1"
        >
          <Shield className="mr-1.5 h-3.5 w-3.5" />
          Policies & Compliance
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Terms of Service & Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Everything you need to know about candidate privacy, recruiter verification, and platform governance.
        </p>
      </div>

      {/* FAQ Accordion / Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-blue-600" />
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs"
            >
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {faq.q}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Terms of Service Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900">
          Platform Terms & Conditions
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>1. Account Authenticity:</strong> All users agree to supply
            accurate, non-fraudulent identification details. Impersonation of
            companies or job seekers will result in permanent account suspension.
          </p>
          <p>
            <strong>2. Data Privacy:</strong> Resumes and applicant profiles are
            strictly shared only with companies to which the candidate explicitly
            submits an application.
          </p>
          <p>
            <strong>3. Fair Recruitment:</strong> Recruiters must post genuine,
            open positions with transparent expectations. Spamming listings or
            requesting unauthorized recruitment fees is strictly prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}


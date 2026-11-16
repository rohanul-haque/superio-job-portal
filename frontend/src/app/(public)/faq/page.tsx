"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import React from "react";

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

export default function FAQPage() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 py-10 md:py-16">
      {/* Hero Header */}
      <section className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Badge
          variant="secondary"
          className="mb-4 gap-1.5 px-3.5 py-1 text-xs font-medium text-[#4F46E5] bg-[#EEF2FF] border-0 rounded-full"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          Help & Support Center
        </Badge>

        <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl">
          Frequently Asked <br />
          <span className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#4338CA] bg-clip-text text-transparent">
            Questions
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Everything you need to know about the Hirenest recruitment platform, candidate verification, resume handling, and employer workflows.
        </p>
      </section>

      {/* FAQ Accordion Section using shadcn/ui Accordion */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full pb-8">
        <Accordion type="single" collapsible defaultValue="faq-0">
          {FAQS.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-base sm:text-lg">
                <div className="flex items-center gap-3.5 text-left">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <span>{faq.q}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-6 sm:pl-[58px]">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}

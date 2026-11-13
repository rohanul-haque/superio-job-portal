import { Briefcase } from "lucide-react";
import Link from "next/link";
import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Super<span className="text-blue-600">io</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Superio Enterprise Job Portal connects ambitious candidates with
              world-class employers.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              For Candidates
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/all-jobs" className="hover:text-blue-600">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/candidate-signup" className="hover:text-blue-600">
                  Create Candidate Account
                </Link>
              </li>
              <li>
                <Link href="/candidate-login" className="hover:text-blue-600">
                  Candidate Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              For Recruiters
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/recruiter-signup" className="hover:text-blue-600">
                  Register Company
                </Link>
              </li>
              <li>
                <Link href="/recruiter-login" className="hover:text-blue-600">
                  Recruiter Dashboard
                </Link>
              </li>
              <li>
                <Link href="/all-jobs" className="hover:text-blue-600">
                  Job Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Platform</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/about" className="hover:text-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/verify-email" className="hover:text-blue-600">
                  Verify Email
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Superio Enterprise. Built with
          Next.js App Router & Express TypeScript. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

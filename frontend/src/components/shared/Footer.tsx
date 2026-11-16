import Logo from "@/components/shared/Logo";
import Link from "next/link";
import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Logo href="/" />
            <p className="text-sm text-slate-500 leading-relaxed">
              Hirenest connects ambitious candidates with world-class employers.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              For Candidates
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/all-jobs" className="hover:text-[#4F46E5] transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/candidate-signup" className="hover:text-[#4F46E5] transition-colors">
                  Create Candidate Account
                </Link>
              </li>
              <li>
                <Link href="/candidate-login" className="hover:text-[#4F46E5] transition-colors">
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
                <Link href="/recruiter-signup" className="hover:text-[#4F46E5] transition-colors">
                  Register Company
                </Link>
              </li>
              <li>
                <Link href="/recruiter-login" className="hover:text-[#4F46E5] transition-colors">
                  Recruiter Dashboard
                </Link>
              </li>
              <li>
                <Link href="/all-jobs" className="hover:text-[#4F46E5] transition-colors">
                  Job Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Platform</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/about" className="hover:text-[#4F46E5] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#4F46E5] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#4F46E5] transition-colors">
                  FAQ & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Hirenest. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

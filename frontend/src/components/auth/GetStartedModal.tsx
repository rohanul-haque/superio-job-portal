"use client";

import RoleSelector, { RoleType } from "@/components/auth/RoleSelector";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleType>("candidate");

  if (!isOpen) return null;

  const handleContinue = () => {
    onClose();
    router.push(`/register?role=${selectedRole}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="get-started-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-8 ring-blue-50/50">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2
            id="get-started-title"
            className="text-2xl font-bold tracking-tight text-slate-900"
          >
            Get Started with Superio
          </h2>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Choose how you want to use the platform to begin your registration.
          </p>
        </div>

        {/* Exact Reference Role Selector */}
        <div className="space-y-4">
          <RoleSelector
            selectedRole={selectedRole}
            onChange={(role) => setSelectedRole(role)}
          />

          {/* Role Benefit Card */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition-all">
            {selectedRole === "candidate" ? (
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Candidate Account
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Explore top jobs, submit verified applications, track interviews, and build your career profile.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Employer / Recruiter Account
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Publish vacancies, discover verified talent, manage applicants, and grow your team.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Continue as {selectedRole === "recruiter" ? "Recruiter" : "Candidate"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GetStartedModal;


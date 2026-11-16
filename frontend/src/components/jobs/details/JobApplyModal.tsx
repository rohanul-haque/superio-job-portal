import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { IJob } from "@/interfaces/job.interface";
import { ArrowRight, FileText, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import React from "react";

export interface JobApplyModalProps {
  job: IJob;
  userName?: string;
  isApplyModalOpen: boolean;
  isResumeWarningOpen: boolean;
  isApplying: boolean;
  onCloseApplyModal: () => void;
  onCloseResumeWarning: () => void;
  onConfirmApply: () => void;
}

export function JobApplyModal({
  job,
  userName,
  isApplyModalOpen,
  isResumeWarningOpen,
  isApplying,
  onCloseApplyModal,
  onCloseResumeWarning,
  onConfirmApply,
}: JobApplyModalProps) {
  return (
    <>
      {/* Resume Required Guard Dialog */}
      {isResumeWarningOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={onCloseResumeWarning}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-8 ring-amber-50/50 mb-4">
              <FileText className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center">
              Resume Upload Required
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 text-center leading-relaxed">
              Enterprise policy requires candidates to have an uploaded PDF
              resume on their profile before submitting applications.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link href="/candidate/dashboard/profile">
                <Button className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-full">
                  Upload Resume in Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={onCloseResumeWarning}
                className="text-slate-600 rounded-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Application Confirmation Modal */}
      {isApplyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={onCloseApplyModal}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-[#0F172A]">
                Confirm Application
              </h3>
              <button
                type="button"
                onClick={onCloseApplyModal}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                You are about to apply for:
              </p>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-[#E5E7EB]">
                <h4 className="text-sm font-bold text-[#0F172A]">{job.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {job.company?.name} • {job.location}
                </p>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-[#EEF2FF] p-3 text-xs text-indigo-950">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#4F46E5] shrink-0" />
                  <span>
                    Your verified profile (<strong>{userName}</strong>) and
                    attached resume will be shared with the recruiter.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                onClick={onCloseApplyModal}
                disabled={isApplying}
                className="text-xs rounded-full"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirmApply}
                disabled={isApplying}
                className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-xs rounded-full"
              >
                {isApplying ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Confirm & Submit"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

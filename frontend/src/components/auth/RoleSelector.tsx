"use client";

import React from "react";

export type RoleType = "candidate" | "recruiter";

interface RoleSelectorProps {
  selectedRole: RoleType;
  onChange: (role: RoleType) => void;
  candidateLabel?: string;
  recruiterLabel?: string;
  className?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onChange,
  candidateLabel = "Candidate",
  recruiterLabel = "Recruiter",
  className = "",
}) => {
  return (
    <div
      className={`relative grid w-full grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs ${className}`}
      role="tablist"
      aria-label="Select Account Type"
    >
      <button
        type="button"
        role="tab"
        aria-selected={selectedRole === "candidate"}
        onClick={() => onChange("candidate")}
        className={`flex h-12 w-full cursor-pointer items-center justify-center text-sm font-semibold transition-colors duration-150 select-none ${
          selectedRole === "candidate"
            ? "bg-blue-600 text-white"
            : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        }`}
      >
        {candidateLabel}
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={selectedRole === "recruiter"}
        onClick={() => onChange("recruiter")}
        className={`flex h-12 w-full cursor-pointer items-center justify-center text-sm font-semibold transition-colors duration-150 select-none ${
          selectedRole === "recruiter"
            ? "bg-blue-600 text-white"
            : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        }`}
      >
        {recruiterLabel}
      </button>
    </div>
  );
};

export default RoleSelector;

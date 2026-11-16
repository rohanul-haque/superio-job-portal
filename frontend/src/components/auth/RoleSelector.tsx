"use client";

import type { RoleType } from "@/types/auth";
import React from "react";

interface RoleSelectorProps {
  selectedRole: RoleType;
  onChange: (role: RoleType) => void;
  candidateLabel?: string;
  recruiterLabel?: string;
  className?: string;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onChange,
  candidateLabel = "Candidate",
  recruiterLabel = "Recruiter",
  className = "",
}) => {
  return (
    <div
      className={`relative grid w-full grid-cols-2 rounded-full border border-[#E5E7EB] bg-white p-1 shadow-none ${className}`}
      role="tablist"
      aria-label="Select Account Type"
    >
      <button
        type="button"
        role="tab"
        aria-selected={selectedRole === "candidate"}
        onClick={() => onChange("candidate")}
        className={`flex h-10 w-full cursor-pointer items-center justify-center text-sm font-medium transition-colors duration-150 select-none rounded-full ${
          selectedRole === "candidate"
            ? "bg-[#6366F1] text-white"
            : "bg-white text-slate-600 hover:text-[#4F46E5]"
        }`}
      >
        {candidateLabel}
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={selectedRole === "recruiter"}
        onClick={() => onChange("recruiter")}
        className={`flex h-10 w-full cursor-pointer items-center justify-center text-sm font-medium transition-colors duration-150 select-none rounded-full ${
          selectedRole === "recruiter"
            ? "bg-[#6366F1] text-white"
            : "bg-white text-slate-600 hover:text-[#4F46E5]"
        }`}
      >
        {recruiterLabel}
      </button>
    </div>
  );
};

export default RoleSelector;

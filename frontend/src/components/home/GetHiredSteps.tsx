import React from "react";
import { User, FileText, Briefcase, Send } from "lucide-react";

interface StepItem {
  id: number;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  icon: React.ReactNode;
}

const STEPS: StepItem[] = [
  {
    id: 1,
    title: "Create an Account",
    description:
      "Signup for the job applicant profile, mention your qualifications, past experiences, and expertise, and scope your interests. Voila! You're all set to find your dream jobs.",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    badgeBg: "bg-orange-100/70",
    icon: (
      <div className="relative flex items-center justify-center">
        <User className="h-6 w-6 stroke-[2.2]" />
      </div>
    ),
  },
  {
    id: 2,
    title: "Search Job",
    description:
      "Once you set your job hunting parameters, you'll find many openings related to your career interest on the home page and even filter out some of the best job openings.",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    badgeBg: "bg-purple-100/70",
    icon: (
      <div className="relative flex items-center justify-center">
        {/* Concentric circular target icon matching reference */}
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-200/80">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-600" />
        </span>
      </div>
    ),
  },
  {
    id: 3,
    title: "Upload CV/ Resume",
    description:
      "From numerous job openings, shortlist the right-match vacancy to your profile and apply right after by uploading your CV/ Resume and answering a couple of questions, if any.",
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    badgeBg: "bg-cyan-100/70",
    icon: (
      <div className="relative flex items-center justify-center">
        <FileText className="h-6 w-6 stroke-[2.2]" />
      </div>
    ),
  },
  {
    id: 4,
    title: "Get Job",
    description:
      "After applying, wait for some time, schedule an interview, and if everything goes right, then get hired more quickly than traditional hiring methods.",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    badgeBg: "bg-amber-100/70",
    icon: (
      <div className="relative flex items-center justify-center">
        <Briefcase className="h-6 w-6 stroke-[2.2]" />
      </div>
    ),
  },
];

export const GetHiredSteps: React.FC = () => {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-8 sm:py-12 overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
          Get Hired in{" "}
          <span className="text-[#4F46E5] bg-gradient-to-r from-[#4F46E5] to-[#6366F1] bg-clip-text text-transparent">
            4 Quick Easy Steps
          </span>
        </h2>
        <p className="mt-3.5 text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
          The quickest and most effective way to get hired by the top firm
          working in your career interest areas.
        </p>
      </div>

      {/* Steps Container with connecting dashed line */}
      <div className="relative">
        {/* Decorative connecting dashed curve line for desktop */}
        <div
          className="hidden lg:block absolute inset-0 pointer-events-none -top-4 z-0"
          aria-hidden="true"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 1100 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Dashed connector path weaving across the cards */}
            <path
              d="M 10 120 C 180 145, 340 100, 520 125 C 700 150, 860 110, 1020 70 L 1050 45"
              stroke="#E5E7EB"
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
          </svg>

          {/* Paper airplane icon at the top-right end of the dashed line */}
          <div className="absolute right-4 -top-3 sm:-top-5 text-[#4F46E5] animate-pulse">
            <svg
              className="w-8 h-8 sm:w-9 sm:h-9 -rotate-12 fill-[#4F46E5] text-[#4F46E5]"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 relative z-10">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-[#E5E7EB] shadow-none hover:border-[#4F46E5] transition-all duration-300 flex flex-col justify-start text-left"
            >
              {/* Circular Icon Badge */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${step.iconBg} ${step.iconColor} mb-6 group-hover:scale-105 transition-transform duration-300`}
              >
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-2.5 tracking-tight group-hover:text-[#4F46E5] transition-colors">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetHiredSteps;

import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import React from "react";

interface LogoProps {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
  subtitle?: string;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  href = "/",
  size = "md",
  subtitle,
  onClick,
}) => {
  const sizeClasses = {
    sm: {
      container: "h-8 w-8 rounded-lg",
      icon: "h-4 w-4",
      text: "text-lg",
      subtext: "text-[10px]",
    },
    md: {
      container: "h-10 w-10 rounded-xl",
      icon: "h-5 w-5",
      text: "text-xl",
      subtext: "text-xs",
    },
    lg: {
      container: "h-12 w-12 rounded-2xl",
      icon: "h-6 w-6",
      text: "text-2xl",
      subtext: "text-xs",
    },
  }[size];

  const content = (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div
        className={`flex ${sizeClasses.container} shrink-0 items-center justify-center bg-[#4F46E5] text-white shadow-none`}
      >
        <BriefcaseBusiness className={sizeClasses.icon} />
      </div>
      <div className="flex flex-col min-w-0 leading-none">
        <span
          className={`${sizeClasses.text} font-bold tracking-tight text-[#0F172A] leading-tight`}
        >
          Hire<span className="text-[#4F46E5]">nest</span>
        </span>
        {subtitle && (
          <span
            className={`${sizeClasses.subtext} font-medium text-slate-500 truncate leading-tight mt-0.5`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center transition-opacity hover:opacity-95"
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;

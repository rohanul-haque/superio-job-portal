"use client";

import type { ICategory } from "@/types/category";
import {
  Briefcase,
  Code,
  Database,
  Headphones,
  Layers,
  LineChart,
  Megaphone,
  Paintbrush,
  Shield,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface CategoryGridProps {
  categories: ICategory[];
  isLoading?: boolean;
}

const getCategoryIcon = (name: string) => {
  const normalized = (name || "").toLowerCase();

  if (
    normalized.includes("dev") ||
    normalized.includes("software") ||
    normalized.includes("code") ||
    normalized.includes("tech")
  ) {
    return <Code className="h-6 w-6 text-[#4F46E5]" />;
  }
  if (
    normalized.includes("design") ||
    normalized.includes("ui") ||
    normalized.includes("creative") ||
    normalized.includes("art")
  ) {
    return <Paintbrush className="h-6 w-6 text-[#6366F1]" />;
  }
  if (
    normalized.includes("market") ||
    normalized.includes("growth") ||
    normalized.includes("sales")
  ) {
    return <Megaphone className="h-6 w-6 text-amber-600" />;
  }
  if (
    normalized.includes("finance") ||
    normalized.includes("account") ||
    normalized.includes("bank")
  ) {
    return <LineChart className="h-6 w-6 text-emerald-600" />;
  }
  if (
    normalized.includes("data") ||
    normalized.includes("ai") ||
    normalized.includes("analytics")
  ) {
    return <Database className="h-6 w-6 text-purple-600" />;
  }
  if (
    normalized.includes("support") ||
    normalized.includes("customer") ||
    normalized.includes("service")
  ) {
    return <Headphones className="h-6 w-6 text-teal-600" />;
  }
  if (
    normalized.includes("security") ||
    normalized.includes("cyber") ||
    normalized.includes("admin")
  ) {
    return <Shield className="h-6 w-6 text-rose-600" />;
  }
  if (normalized.includes("product") || normalized.includes("manage")) {
    return <Layers className="h-6 w-6 text-indigo-600" />;
  }
  return <Briefcase className="h-6 w-6 text-[#4F46E5]" />;
};

const CategoryIconDisplay: React.FC<{
  name: string;
  icon?: { url: string; publicId: string } | null;
}> = ({ name, icon }) => {
  const [imageError, setImageError] = React.useState(false);

  if (icon?.url && !imageError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={icon.url}
        alt={name}
        className="h-7 w-7 object-contain rounded-lg"
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  }

  return getCategoryIcon(name);
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-[#E5E7EB] bg-slate-50 p-6"
          />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E5E7EB] p-8 text-center bg-slate-50/50">
        <Sparkles className="mx-auto h-8 w-8 text-slate-400" />
        <p className="mt-2 text-sm font-medium text-slate-600">
          No categories published yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {categories.map((category) => {
        const count = category.jobCount ?? category._count?.jobs ?? 0;
        return (
          <Link
            key={category.id}
            href={`/all-jobs?category=${encodeURIComponent(category.id)}`}
            className="group flex flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 transition-all duration-200 hover:border-[#4F46E5] hover:-translate-y-0.5 shadow-none"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-[#EEF2FF] transition-colors">
              <CategoryIconDisplay name={category.name} icon={category.icon} />
            </div>

            <div className="mt-4">
              <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors line-clamp-1">
                {category.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                {count} {count === 1 ? "Open Position" : "Open Positions"}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryGrid;

"use client";

import type { ICategory } from "@/types/category";
import { motion, useReducedMotion } from "framer-motion";
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
    return <Code className="h-5 w-5 text-[#4F46E5]" />;
  }
  if (
    normalized.includes("design") ||
    normalized.includes("ui") ||
    normalized.includes("creative") ||
    normalized.includes("art")
  ) {
    return <Paintbrush className="h-5 w-5 text-[#6366F1]" />;
  }
  if (
    normalized.includes("market") ||
    normalized.includes("growth") ||
    normalized.includes("sales")
  ) {
    return <Megaphone className="h-5 w-5 text-amber-600" />;
  }
  if (
    normalized.includes("finance") ||
    normalized.includes("account") ||
    normalized.includes("bank")
  ) {
    return <LineChart className="h-5 w-5 text-emerald-600" />;
  }
  if (
    normalized.includes("data") ||
    normalized.includes("ai") ||
    normalized.includes("analytics")
  ) {
    return <Database className="h-5 w-5 text-purple-600" />;
  }
  if (
    normalized.includes("support") ||
    normalized.includes("customer") ||
    normalized.includes("service")
  ) {
    return <Headphones className="h-5 w-5 text-teal-600" />;
  }
  if (
    normalized.includes("security") ||
    normalized.includes("cyber") ||
    normalized.includes("admin")
  ) {
    return <Shield className="h-5 w-5 text-rose-600" />;
  }
  if (normalized.includes("product") || normalized.includes("manage")) {
    return <Layers className="h-5 w-5 text-indigo-600" />;
  }
  return <Briefcase className="h-5 w-5 text-[#4F46E5]" />;
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
        className="h-6 w-6 object-contain rounded-md"
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
  const shouldReduceMotion = useReducedMotion();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl sm:rounded-2xl border border-[#E5E7EB] bg-slate-50 p-4 sm:p-5"
          />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="rounded-xl sm:rounded-2xl border border-dashed border-[#E5E7EB] p-8 text-center bg-slate-50/50">
        <Sparkles className="mx-auto h-7 w-7 text-slate-400" />
        <p className="mt-2 text-sm font-medium text-slate-600">
          No categories published yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {categories.map((category, index) => {
        const count = category.jobCount ?? category._count?.jobs ?? 0;
        return (
          <motion.div
            key={category.id}
            initial={
              shouldReduceMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.45,
              delay: shouldReduceMotion ? 0 : index * 0.05,
              ease: [0.25, 0.1, 0.25, 1.0],
            }}
          >
            <Link
              href={`/all-jobs?category=${encodeURIComponent(category.id)}`}
              className="group flex flex-col justify-between rounded-xl sm:rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5 transition-colors duration-200 hover:border-[#4F46E5] shadow-none h-full"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-[#EEF2FF] transition-colors">
                <CategoryIconDisplay name={category.name} icon={category.icon} />
              </div>

              <div className="mt-3.5">
                <h3 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors line-clamp-1">
                  {category.name}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 font-normal">
                  {count} {count === 1 ? "Open Position" : "Open Positions"}
                </p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CategoryGrid;

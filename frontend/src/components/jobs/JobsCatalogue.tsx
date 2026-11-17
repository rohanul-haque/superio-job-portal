"use client";

import JobCard from "@/components/jobs/JobCard";
import { JobCardSkeleton } from "@/components/shared/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryKeys } from "@/lib/query-keys";
import { getAllCategories } from "@/services/category.service";
import { getAllJobs } from "@/services/job.service";
import type { ICategory } from "@/types/category";
import type { IJob, IJobsResponseMeta } from "@/types/job";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ArrowUpDown,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Remote",
  "Contract",
  "Internship",
];

const EXPERIENCE_LEVELS = [
  "Beginner level",
  "Intermediate level",
  "Senior level",
];

const POPULAR_LOCATIONS = [
  "Remote",
  "New York, USA",
  "San Francisco, USA",
  "London, UK",
  "Berlin, Germany",
  "Austin, USA",
];

/**
 * Custom hook for debouncing input values by specified delay (default 450ms).
 * If the value is an empty string, updates immediately for snappy clear/reset.
 */
function useDebounce<T>(value: T, delay: number = 450): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    if (typeof value === "string" && value.trim() === "") {
      setDebouncedValue(value);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface FilterSidebarContentProps {
  keyword: string;
  onKeywordChange: (val: string) => void;
  categories: ICategory[];
  selectedCategories: string[];
  onToggleCategory: (catId: string) => void;
  selectedJobTypes: string[];
  onToggleJobType: (type: string) => void;
  selectedLevels: string[];
  onToggleLevel: (level: string) => void;
  selectedLocations: string[];
  onToggleLocation: (loc: string) => void;
  customLocation: string;
  onCustomLocationChange: (val: string) => void;
  minSalary: string;
  onMinSalaryChange: (val: string) => void;
  maxSalary: string;
  onMaxSalaryChange: (val: string) => void;
  salaryError: string | null;
  activeFilterCount: number;
  onResetFilters: () => void;
}

/**
 * FilterSidebarContent component declared OUTSIDE JobsCatalogue.
 * Maintaining a stable component reference prevents React from unmounting
 * and destroying input DOM nodes on re-renders, fixing the focus loss bug completely.
 */
const FilterSidebarContent: React.FC<FilterSidebarContentProps> = ({
  keyword,
  onKeywordChange,
  categories,
  selectedCategories,
  onToggleCategory,
  selectedJobTypes,
  onToggleJobType,
  selectedLevels,
  onToggleLevel,
  selectedLocations,
  onToggleLocation,
  customLocation,
  onCustomLocationChange,
  minSalary,
  onMinSalaryChange,
  maxSalary,
  onMaxSalaryChange,
  salaryError,
  activeFilterCount,
  onResetFilters,
}) => {
  return (
    <div className="space-y-6">
      {/* Header & Reset Button */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-[#4F46E5]" />
          <h3 className="font-bold text-[#0F172A] text-base">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge className="bg-[#4F46E5] text-white text-[11px] px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* 1. Keyword Search */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Search Keyword
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Job title or tags..."
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* 2. Job Categories */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
          <span>Categories</span>
          <span className="text-[10px] font-normal text-slate-400 lowercase">
            ({categories.length})
          </span>
        </label>
        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
          {categories.map((cat) => {
            const count = cat.jobCount ?? cat._count?.jobs ?? 0;
            const isChecked = selectedCategories.includes(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 cursor-pointer py-1"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleCategory(cat.id)}
                    className="rounded border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                  />
                  <span
                    className={isChecked ? "font-semibold text-[#4F46E5]" : ""}
                  >
                    {cat.name}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Job Type */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
          Job Type
        </label>
        <div className="space-y-1.5">
          {JOB_TYPES.map((type) => {
            const isChecked = selectedJobTypes.includes(type);
            return (
              <label
                key={type}
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleJobType(type)}
                  className="rounded border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                />
                <span
                  className={isChecked ? "font-semibold text-[#4F46E5]" : ""}
                >
                  {type}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Experience Level */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
          Experience Level
        </label>
        <div className="space-y-1.5">
          {EXPERIENCE_LEVELS.map((level) => {
            const isChecked = selectedLevels.includes(level);
            return (
              <label
                key={level}
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleLevel(level)}
                  className="rounded border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                />
                <span
                  className={isChecked ? "font-semibold text-[#4F46E5]" : ""}
                >
                  {level}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Location */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
          Location
        </label>
        <div className="space-y-1.5">
          {POPULAR_LOCATIONS.map((loc) => {
            const isChecked = selectedLocations.includes(loc);
            return (
              <label
                key={loc}
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleLocation(loc)}
                  className="rounded border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                />
                <span
                  className={isChecked ? "font-semibold text-[#4F46E5]" : ""}
                >
                  {loc}
                </span>
              </label>
            );
          })}
        </div>
        <div className="pt-1">
          <Input
            type="text"
            placeholder="Custom city/country..."
            value={customLocation}
            onChange={(e) => onCustomLocationChange(e.target.value)}
            className="text-xs h-8"
          />
        </div>
      </div>

      {/* 6. Salary Range */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Monthly Salary ($ USD)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Input
              type="number"
              min="0"
              placeholder="Min ($)"
              value={minSalary}
              onChange={(e) => onMinSalaryChange(e.target.value)}
              className={`text-xs h-8 ${
                salaryError ? "border-red-400 focus-visible:ring-red-400" : ""
              }`}
            />
          </div>
          <div>
            <Input
              type="number"
              min="0"
              placeholder="Max ($)"
              value={maxSalary}
              onChange={(e) => onMaxSalaryChange(e.target.value)}
              className={`text-xs h-8 ${
                salaryError ? "border-red-400 focus-visible:ring-red-400" : ""
              }`}
            />
          </div>
        </div>
        {salaryError && (
          <p className="text-[11px] text-red-600 font-medium leading-tight">
            {salaryError}
          </p>
        )}
      </div>
    </div>
  );
};

const JobsCatalogue: React.FC = () => {
  const searchParams = useSearchParams();

  // Initial URL Query State
  const initialKeyword =
    searchParams.get("keyword") || searchParams.get("search") || "";
  const initialCategory =
    searchParams.get("category") || searchParams.get("categoryId") || "";
  const initialLocation = searchParams.get("location") || "";
  const isPopularLocation = POPULAR_LOCATIONS.includes(initialLocation);
  const initialSelectedLocations = isPopularLocation ? [initialLocation] : [];
  const initialCustomLoc =
    !isPopularLocation && initialLocation ? initialLocation : "";
  const initialJobType = searchParams.get("jobType")
    ? searchParams.get("jobType")!.split(",").filter(Boolean)
    : [];
  const initialLevel = searchParams.get("level")
    ? searchParams.get("level")!.split(",").filter(Boolean)
    : [];
  const initialMinSalary = searchParams.get("minSalary") || "";
  const initialMaxSalary = searchParams.get("maxSalary") || "";
  const initialSortBy =
    (searchParams.get("sortBy") as
      | "newest"
      | "salary_desc"
      | "salary_asc"
      | "deadline") || "newest";
  const initialPage = Number(searchParams.get("page")) || 1;

  // Immediate Input States (smooth typing, immediate UI feedback)
  const [keywordInput, setKeywordInput] = useState(initialKeyword);
  const [customLocationInput, setCustomLocationInput] =
    useState(initialCustomLoc);
  const [minSalaryInput, setMinSalaryInput] = useState(initialMinSalary);
  const [maxSalaryInput, setMaxSalaryInput] = useState(initialMaxSalary);

  // Debounced States (450ms debounce for network requests and URL sync)
  const debouncedKeyword = useDebounce(keywordInput, 450);
  const debouncedCustomLocation = useDebounce(customLocationInput, 450);
  const debouncedMinSalary = useDebounce(minSalaryInput, 450);
  const debouncedMaxSalary = useDebounce(maxSalaryInput, 450);

  // Non-debounced Filter States (immediate response on click)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialSelectedLocations,
  );
  const [selectedJobTypes, setSelectedJobTypes] =
    useState<string[]>(initialJobType);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(initialLevel);
  const [sortBy, setSortBy] = useState<
    "newest" | "salary_desc" | "salary_asc" | "deadline"
  >(initialSortBy);
  const [page, setPage] = useState(initialPage);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Salary Validation
  const salaryValidation = useMemo(() => {
    const minTrimmed = minSalaryInput.trim();
    const maxTrimmed = maxSalaryInput.trim();

    const minNum = minTrimmed !== "" ? Number(minTrimmed) : null;
    const maxNum = maxTrimmed !== "" ? Number(maxTrimmed) : null;

    if (minNum !== null && isNaN(minNum)) {
      return { isValid: false, error: "Minimum salary must be a valid number" };
    }
    if (maxNum !== null && isNaN(maxNum)) {
      return { isValid: false, error: "Maximum salary must be a valid number" };
    }
    if (minNum !== null && minNum < 0) {
      return { isValid: false, error: "Minimum salary cannot be negative" };
    }
    if (maxNum !== null && maxNum < 0) {
      return { isValid: false, error: "Maximum salary cannot be negative" };
    }
    if (minNum !== null && maxNum !== null && minNum > maxNum) {
      return {
        isValid: false,
        error: "Minimum salary cannot exceed maximum salary",
      };
    }

    return { isValid: true, error: null };
  }, [minSalaryInput, maxSalaryInput]);

  const debouncedMinNum = useMemo(() => {
    const trimmed = debouncedMinSalary.trim();
    if (!trimmed || isNaN(Number(trimmed))) return null;
    return Number(trimmed);
  }, [debouncedMinSalary]);

  const debouncedMaxNum = useMemo(() => {
    const trimmed = debouncedMaxSalary.trim();
    if (!trimmed || isNaN(Number(trimmed))) return null;
    return Number(trimmed);
  }, [debouncedMaxSalary]);

  const isDebouncedSalaryValid = useMemo(() => {
    if (debouncedMinNum !== null && debouncedMinNum < 0) return false;
    if (debouncedMaxNum !== null && debouncedMaxNum < 0) return false;
    if (
      debouncedMinNum !== null &&
      debouncedMaxNum !== null &&
      debouncedMinNum > debouncedMaxNum
    ) {
      return false;
    }
    return true;
  }, [debouncedMinNum, debouncedMaxNum]);

  // Construct stable query parameters for TanStack Query
  const filterParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page,
      limit: 10,
      sortBy,
      hiringStatus: "Ongoing",
    };

    if (debouncedKeyword.trim()) {
      params.keyword = debouncedKeyword.trim();
    }

    if (selectedCategories.length > 0) {
      params.category = selectedCategories.join(",");
    }

    const activeLocations = [...selectedLocations];
    if (
      debouncedCustomLocation.trim() &&
      !activeLocations.includes(debouncedCustomLocation.trim())
    ) {
      activeLocations.push(debouncedCustomLocation.trim());
    }
    if (activeLocations.length > 0) {
      params.location = activeLocations.join(",");
    }

    if (selectedJobTypes.length > 0) {
      params.jobType = selectedJobTypes.join(",");
    }

    if (selectedLevels.length > 0) {
      params.level = selectedLevels.join(",");
    }

    if (isDebouncedSalaryValid) {
      if (debouncedMinNum !== null) params.minSalary = debouncedMinNum;
      if (debouncedMaxNum !== null) params.maxSalary = debouncedMaxNum;
    }

    return params;
  }, [
    page,
    sortBy,
    debouncedKeyword,
    selectedCategories,
    selectedLocations,
    debouncedCustomLocation,
    selectedJobTypes,
    selectedLevels,
    isDebouncedSalaryValid,
    debouncedMinNum,
    debouncedMaxNum,
  ]);

  // Categories Query
  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.list({ isActive: "true" }),
    queryFn: () => getAllCategories({ isActive: "true" }),
  });

  // Jobs Query with keepPreviousData to prevent layout collapsing & scroll jumps
  const jobsQuery = useQuery({
    queryKey: queryKeys.jobs.list(filterParams),
    queryFn: () => getAllJobs(filterParams),
    placeholderData: keepPreviousData,
  });

  const categories: ICategory[] = categoriesQuery.data || [];
  const jobs: IJob[] = jobsQuery.data?.jobs || [];
  const meta: IJobsResponseMeta = jobsQuery.data?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };
  const isInitialLoading = jobsQuery.isLoading;

  // Track initial mount so we do NOT reset page to 1 on initial load
  const isInitialMount = useRef(true);

  // Reset page to 1 whenever any debounced search filter or click filter changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setPage(1);
  }, [
    debouncedKeyword,
    selectedCategories,
    selectedLocations,
    debouncedCustomLocation,
    selectedJobTypes,
    selectedLevels,
    debouncedMinSalary,
    debouncedMaxSalary,
    sortBy,
  ]);

  // Synchronize URL query parameters cleanly with window.history.replaceState
  // This avoids Next.js router transitions, Suspense fallbacks, and scroll-to-top resets
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedKeyword.trim()) {
      params.set("keyword", debouncedKeyword.trim());
    }

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }

    const allLocations = [...selectedLocations];
    if (
      debouncedCustomLocation.trim() &&
      !allLocations.includes(debouncedCustomLocation.trim())
    ) {
      allLocations.push(debouncedCustomLocation.trim());
    }
    if (allLocations.length > 0) {
      params.set("location", allLocations.join(","));
    }

    if (selectedJobTypes.length > 0) {
      params.set("jobType", selectedJobTypes.join(","));
    }

    if (selectedLevels.length > 0) {
      params.set("level", selectedLevels.join(","));
    }

    if (isDebouncedSalaryValid) {
      if (debouncedMinSalary.trim() && debouncedMinNum !== null) {
        params.set("minSalary", String(debouncedMinNum));
      }
      if (debouncedMaxSalary.trim() && debouncedMaxNum !== null) {
        params.set("maxSalary", String(debouncedMaxNum));
      }
    }

    if (sortBy !== "newest") {
      params.set("sortBy", sortBy);
    }

    if (page > 1) {
      params.set("page", String(page));
    }

    const qs = params.toString();
    const targetUrl = qs ? `/all-jobs?${qs}` : "/all-jobs";

    if (typeof window !== "undefined") {
      const currentUrl = window.location.pathname + window.location.search;
      if (currentUrl !== targetUrl) {
        window.history.replaceState(window.history.state, "", targetUrl);
      }
    }
  }, [
    debouncedKeyword,
    selectedCategories,
    selectedLocations,
    debouncedCustomLocation,
    selectedJobTypes,
    selectedLevels,
    debouncedMinSalary,
    debouncedMaxSalary,
    debouncedMinNum,
    debouncedMaxNum,
    isDebouncedSalaryValid,
    sortBy,
    page,
  ]);

  // Filter toggle handlers
  const handleToggleCategory = useCallback((catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId],
    );
  }, []);

  const handleToggleLocation = useCallback((loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
    );
  }, []);

  const handleToggleJobType = useCallback((type: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }, []);

  const handleToggleLevel = useCallback((lvl: string) => {
    setSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl],
    );
  }, []);

  const handleResetFilters = useCallback(() => {
    setKeywordInput("");
    setSelectedCategories([]);
    setSelectedLocations([]);
    setCustomLocationInput("");
    setSelectedJobTypes([]);
    setSelectedLevels([]);
    setMinSalaryInput("");
    setMaxSalaryInput("");
    setSortBy("newest");
    setPage(1);
  }, []);

  const activeFilterCount =
    (keywordInput.trim() ? 1 : 0) +
    selectedCategories.length +
    selectedLocations.length +
    (customLocationInput.trim() ? 1 : 0) +
    selectedJobTypes.length +
    selectedLevels.length +
    (minSalaryInput.trim() || maxSalaryInput.trim() ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-3.5 py-1 rounded-full">
            Job Catalogue
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">
            Explore Open Opportunities
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Showing {meta.total} {meta.total === 1 ? "vacancy" : "vacancies"}{" "}
            matching your criteria
          </p>
        </div>

        {/* Sorting Dropdown & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-medium text-[#0F172A] shadow-none hover:bg-slate-50 lg:hidden cursor-pointer"
          >
            <Filter className="h-4 w-4 text-[#4F46E5]" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          <div className="flex items-center gap-2">
            <Select
              value={sortBy}
              onValueChange={(val) => {
                setSortBy(
                  val as "newest" | "salary_desc" | "salary_asc" | "deadline",
                );
              }}
            >
              <SelectTrigger className="h-10 rounded-full border border-[#E5E7EB] bg-white px-4 text-xs font-medium text-[#0F172A] shadow-none min-w-[190px]">
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-500">
                    Sort:
                  </span>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="salary_desc">Salary: High to Low</SelectItem>
                <SelectItem value="salary_asc">Salary: Low to High</SelectItem>
                <SelectItem value="deadline">Deadline Approaching</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {activeFilterCount > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">
            Active filters:
          </span>
          {keywordInput.trim() && (
            <Badge
              variant="secondary"
              className="gap-1 bg-[#EEF2FF] text-[#4F46E5] border-transparent text-xs rounded-full"
            >
              Keyword: {keywordInput.trim()}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setKeywordInput("")}
              />
            </Badge>
          )}
          {selectedCategories.map((catId) => {
            const cat = categories.find((c) => c.id === catId);
            return (
              <Badge
                key={catId}
                variant="secondary"
                className="gap-1 bg-[#EEF2FF] text-[#4F46E5] border-transparent text-xs rounded-full"
              >
                Category: {cat?.name || catId}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleToggleCategory(catId)}
                />
              </Badge>
            );
          })}
          {selectedJobTypes.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
            >
              {type}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleToggleJobType(type)}
              />
            </Badge>
          ))}
          {selectedLevels.map((lvl) => (
            <Badge
              key={lvl}
              variant="secondary"
              className="gap-1 bg-purple-50 text-purple-700 border-purple-200 text-xs"
            >
              {lvl}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleToggleLevel(lvl)}
              />
            </Badge>
          ))}
          {selectedLocations.map((loc) => (
            <Badge
              key={loc}
              variant="secondary"
              className="gap-1 bg-amber-50 text-amber-700 border-amber-200 text-xs"
            >
              {loc}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleToggleLocation(loc)}
              />
            </Badge>
          ))}
          {customLocationInput.trim() && (
            <Badge
              variant="secondary"
              className="gap-1 bg-amber-50 text-amber-700 border-amber-200 text-xs"
            >
              Location: {customLocationInput.trim()}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setCustomLocationInput("")}
              />
            </Badge>
          )}
          {isDebouncedSalaryValid &&
            (minSalaryInput.trim() || maxSalaryInput.trim()) && (
              <Badge
                variant="secondary"
                className="gap-1 bg-slate-100 text-slate-700 text-xs"
              >
                Salary:{" "}
                {minSalaryInput.trim()
                  ? `$${Number(minSalaryInput.trim()).toLocaleString()}`
                  : "$0"}{" "}
                -{" "}
                {maxSalaryInput.trim()
                  ? `$${Number(maxSalaryInput.trim()).toLocaleString()}`
                  : "Any"}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setMinSalaryInput("");
                    setMaxSalaryInput("");
                  }}
                />
              </Badge>
            )}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-[#4F46E5] hover:underline font-semibold ml-1 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid: Left Sidebar + Right Job Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs h-fit sticky top-24">
          <FilterSidebarContent
            keyword={keywordInput}
            onKeywordChange={setKeywordInput}
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            selectedJobTypes={selectedJobTypes}
            onToggleJobType={handleToggleJobType}
            selectedLevels={selectedLevels}
            onToggleLevel={handleToggleLevel}
            selectedLocations={selectedLocations}
            onToggleLocation={handleToggleLocation}
            customLocation={customLocationInput}
            onCustomLocationChange={setCustomLocationInput}
            minSalary={minSalaryInput}
            onMinSalaryChange={setMinSalaryInput}
            maxSalary={maxSalaryInput}
            onMaxSalaryChange={setMaxSalaryInput}
            salaryError={salaryValidation.error}
            activeFilterCount={activeFilterCount}
            onResetFilters={handleResetFilters}
          />
        </aside>

        {/* Right Job Cards Grid */}
        <main className="lg:col-span-3 space-y-6">
          {isInitialLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-200 ${
                  jobsQuery.isFetching ? "opacity-60" : "opacity-100"
                }`}
              >
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Pagination Controls */}
              {meta.totalPage > 1 && (
                <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
                  <p className="text-xs text-slate-500">
                    Page{" "}
                    <span className="font-bold text-slate-800">
                      {meta.page}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-slate-800">
                      {meta.totalPage}
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={meta.page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="text-xs gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: meta.totalPage }).map((_, idx) => {
                        const pNum = idx + 1;
                        if (
                          pNum === 1 ||
                          pNum === meta.totalPage ||
                          (pNum >= meta.page - 1 && pNum <= meta.page + 1)
                        ) {
                          return (
                            <Button
                              type="button"
                              key={pNum}
                              variant={
                                pNum === meta.page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setPage(pNum)}
                              className={`h-8 w-8 p-0 text-xs rounded-full ${
                                pNum === meta.page
                                  ? "bg-[#6366F1] text-white"
                                  : "text-[#0F172A] border-[#E5E7EB]"
                              }`}
                            >
                              {pNum}
                            </Button>
                          );
                        }
                        if (pNum === meta.page - 2 || pNum === meta.page + 2) {
                          return (
                            <span
                              key={pNum}
                              className="text-xs text-slate-400 px-1"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={meta.page >= meta.totalPage}
                      onClick={() =>
                        setPage((p) => Math.min(meta.totalPage, p + 1))
                      }
                      className="text-xs gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-slate-50/50">
              <Briefcase className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-3 text-lg font-bold text-slate-800">
                No job postings found
              </h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                No active vacancies match your current filter parameters. Try
                loosening your filters or search terms.
              </p>
              <div className="mt-5">
                <Button
                  type="button"
                  onClick={handleResetFilters}
                  variant="outline"
                  className="text-xs font-semibold"
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Reset All Filters
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="w-full max-w-xs h-full bg-white p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Filter Jobs</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterSidebarContent
              keyword={keywordInput}
              onKeywordChange={setKeywordInput}
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              selectedJobTypes={selectedJobTypes}
              onToggleJobType={handleToggleJobType}
              selectedLevels={selectedLevels}
              onToggleLevel={handleToggleLevel}
              selectedLocations={selectedLocations}
              onToggleLocation={handleToggleLocation}
              customLocation={customLocationInput}
              onCustomLocationChange={setCustomLocationInput}
              minSalary={minSalaryInput}
              onMinSalaryChange={setMinSalaryInput}
              maxSalary={maxSalaryInput}
              onMaxSalaryChange={setMaxSalaryInput}
              salaryError={salaryValidation.error}
              activeFilterCount={activeFilterCount}
              onResetFilters={handleResetFilters}
            />
            <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
              <Button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-full"
              >
                Show Results ({meta.total})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsCatalogue;

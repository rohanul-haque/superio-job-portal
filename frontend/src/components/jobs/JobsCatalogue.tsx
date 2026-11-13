"use client";

import JobCard from "@/components/jobs/JobCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import categoryService from "@/services/category.service";
import jobService from "@/services/job.service";
import type { ICategory } from "@/types/category";
import type { IJob, IJobsResponseMeta } from "@/types/job";
import {
  ArrowUpDown,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

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

export const JobsCatalogue: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query State
  const initialKeyword = searchParams.get("keyword") || searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || searchParams.get("categoryId") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialJobType = searchParams.get("jobType") ? searchParams.get("jobType")!.split(",") : [];
  const initialLevel = searchParams.get("level") ? searchParams.get("level")!.split(",") : [];
  const initialMinSalary = searchParams.get("minSalary") || "";
  const initialMaxSalary = searchParams.get("maxSalary") || "";
  const initialSortBy = (searchParams.get("sortBy") as "newest" | "salary_desc" | "salary_asc" | "deadline") || "newest";
  const initialPage = Number(searchParams.get("page")) || 1;

  // Local Filter State
  const [keyword, setKeyword] = useState(initialKeyword);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialLocation ? [initialLocation] : [],
  );
  const [customLocation, setCustomLocation] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(initialJobType);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(initialLevel);
  const [minSalary, setMinSalary] = useState(initialMinSalary);
  const [maxSalary, setMaxSalary] = useState(initialMaxSalary);
  const [sortBy, setSortBy] = useState<"newest" | "salary_desc" | "salary_asc" | "deadline">(initialSortBy);
  const [page, setPage] = useState(initialPage);

  // Data & Loading State
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [meta, setMeta] = useState<IJobsResponseMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch Categories for sidebar filters
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await categoryService.getAllCategories({ isActive: "true" });
        setCategories(catRes || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Sync state to URL and fetch jobs
  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit: 9,
        sortBy,
        hiringStatus: "Ongoing",
      };

      if (keyword.trim()) params.keyword = keyword.trim();
      if (selectedCategories.length > 0) params.category = selectedCategories.join(",");
      
      const activeLocations = [...selectedLocations];
      if (customLocation.trim() && !activeLocations.includes(customLocation.trim())) {
        activeLocations.push(customLocation.trim());
      }
      if (activeLocations.length > 0) params.location = activeLocations.join(",");
      if (selectedJobTypes.length > 0) params.jobType = selectedJobTypes.join(",");
      if (selectedLevels.length > 0) params.level = selectedLevels.join(",");
      if (minSalary && !isNaN(Number(minSalary))) params.minSalary = Number(minSalary);
      if (maxSalary && !isNaN(Number(maxSalary))) params.maxSalary = Number(maxSalary);

      const res = await jobService.getAllJobs(params);
      setJobs(res.jobs);
      setMeta(res.meta);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    keyword,
    selectedCategories,
    selectedLocations,
    customLocation,
    selectedJobTypes,
    selectedLevels,
    minSalary,
    maxSalary,
    sortBy,
    page,
  ]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Update query params in URL when user changes filters
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (selectedCategories.length > 0) params.set("category", selectedCategories.join(","));
    if (selectedLocations.length > 0) params.set("location", selectedLocations.join(","));
    if (customLocation.trim()) params.set("location", customLocation.trim());
    if (selectedJobTypes.length > 0) params.set("jobType", selectedJobTypes.join(","));
    if (selectedLevels.length > 0) params.set("level", selectedLevels.join(","));
    if (minSalary) params.set("minSalary", minSalary);
    if (maxSalary) params.set("maxSalary", maxSalary);
    if (sortBy !== "newest") params.set("sortBy", sortBy);
    if (page > 1) params.set("page", String(page));

    const qs = params.toString();
    router.replace(qs ? `/all-jobs?${qs}` : "/all-jobs", { scroll: false });
  }, [
    keyword,
    selectedCategories,
    selectedLocations,
    customLocation,
    selectedJobTypes,
    selectedLevels,
    minSalary,
    maxSalary,
    sortBy,
    page,
    router,
  ]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  // Filter toggles
  const handleToggleCategory = (catId: string) => {
    setPage(1);
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId],
    );
  };

  const handleToggleLocation = (loc: string) => {
    setPage(1);
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
    );
  };

  const handleToggleJobType = (type: string) => {
    setPage(1);
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleToggleLevel = (lvl: string) => {
    setPage(1);
    setSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl],
    );
  };

  const handleResetFilters = () => {
    setKeyword("");
    setSelectedCategories([]);
    setSelectedLocations([]);
    setCustomLocation("");
    setSelectedJobTypes([]);
    setSelectedLevels([]);
    setMinSalary("");
    setMaxSalary("");
    setSortBy("newest");
    setPage(1);
  };

  const activeFilterCount =
    (keyword ? 1 : 0) +
    selectedCategories.length +
    selectedLocations.length +
    (customLocation ? 1 : 0) +
    selectedJobTypes.length +
    selectedLevels.length +
    (minSalary || maxSalary ? 1 : 0);

  // Filter Sidebar View Component
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Header & Reset Button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-base">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge className="bg-blue-600 text-white text-[11px] px-2 py-0.5">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleResetFilters}
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
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
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
                    onChange={() => handleToggleCategory(cat.id)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className={isChecked ? "font-semibold text-blue-600" : ""}>
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
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
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
                  onChange={() => handleToggleJobType(type)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className={isChecked ? "font-semibold text-blue-600" : ""}>
                  {type}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Experience Level */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
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
                  onChange={() => handleToggleLevel(level)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className={isChecked ? "font-semibold text-blue-600" : ""}>
                  {level}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Location */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
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
                  onChange={() => handleToggleLocation(loc)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className={isChecked ? "font-semibold text-blue-600" : ""}>
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
            onChange={(e) => {
              setCustomLocation(e.target.value);
              setPage(1);
            }}
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
          <Input
            type="number"
            placeholder="Min ($)"
            value={minSalary}
            onChange={(e) => {
              setMinSalary(e.target.value);
              setPage(1);
            }}
            className="text-xs h-8"
          />
          <Input
            type="number"
            placeholder="Max ($)"
            value={maxSalary}
            onChange={(e) => {
              setMaxSalary(e.target.value);
              setPage(1);
            }}
            className="text-xs h-8"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Job Catalogue
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Explore Open Opportunities
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Showing {meta.total} {meta.total === 1 ? "vacancy" : "vacancies"} matching your criteria
          </p>
        </div>

        {/* Sorting Dropdown & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 lg:hidden cursor-pointer"
          >
            <Filter className="h-4 w-4 text-blue-600" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          <div className="flex items-center gap-2">
            <Select
              value={sortBy}
              onValueChange={(val) => {
                setSortBy(
                  val as "newest" | "salary_desc" | "salary_asc" | "deadline"
                );
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 shadow-xs min-w-[190px]">
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-500">Sort:</span>
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
          <span className="text-xs font-semibold text-slate-500">Active filters:</span>
          {keyword && (
            <Badge
              variant="secondary"
              className="gap-1 bg-blue-50 text-blue-700 border-blue-200 text-xs"
            >
              Keyword: {keyword}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setKeyword("")}
              />
            </Badge>
          )}
          {selectedCategories.map((catId) => {
            const cat = categories.find((c) => c.id === catId);
            return (
              <Badge
                key={catId}
                variant="secondary"
                className="gap-1 bg-blue-50 text-blue-700 border-blue-200 text-xs"
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
          {(minSalary || maxSalary) && (
            <Badge
              variant="secondary"
              className="gap-1 bg-slate-100 text-slate-700 text-xs"
            >
              Salary: ${minSalary || "0"} - ${maxSalary || "Any"}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setMinSalary("");
                  setMaxSalary("");
                }}
              />
            </Badge>
          )}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-blue-600 hover:underline font-semibold ml-1 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid: Left Sidebar + Right Job Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs h-fit sticky top-24">
          <FilterSidebar />
        </aside>

        {/* Right Job Cards Grid */}
        <main className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-2xl border border-slate-100 bg-slate-50 p-6"
                />
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Pagination Controls */}
              {meta.totalPage > 1 && (
                <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
                  <p className="text-xs text-slate-500">
                    Page <span className="font-bold text-slate-800">{meta.page}</span> of{" "}
                    <span className="font-bold text-slate-800">{meta.totalPage}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
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
                              key={pNum}
                              variant={pNum === meta.page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPage(pNum)}
                              className={`h-8 w-8 p-0 text-xs ${
                                pNum === meta.page
                                  ? "bg-blue-600 text-white"
                                  : "text-slate-700"
                              }`}
                            >
                              {pNum}
                            </Button>
                          );
                        }
                        if (pNum === meta.page - 2 || pNum === meta.page + 2) {
                          return (
                            <span key={pNum} className="text-xs text-slate-400 px-1">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={meta.page >= meta.totalPage}
                      onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
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
                No active vacancies match your current filter parameters. Try loosening
                your filters or search terms.
              </p>
              <div className="mt-5">
                <Button
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
            <FilterSidebar />
            <div className="mt-6 pt-4 border-t border-slate-200">
              <Button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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


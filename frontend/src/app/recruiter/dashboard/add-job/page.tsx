"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import TiptapEditor from "@/components/shared/TiptapEditor";
import categoryService from "@/services/category.service";
import recruiterService from "@/services/recruiter.service";
import type { ICategory } from "@/types/category";
import type { ExperienceLevel, JobType } from "@/types/job";
import {
  AlertCircle,
  Briefcase,
  Calendar as CalendarIcon,
  CheckCircle2,
  DollarSign,
  Layers,
  Loader2,
  MapPin,
  PlusCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const JOB_TYPES: JobType[] = [
  "Full-time",
  "Part-time",
  "Remote",
  "Contract",
  "Internship",
];

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  "Beginner level",
  "Intermediate level",
  "Senior level",
];

export default function RecruiterAddJobPage() {
  const router = useRouter();

  // Dynamic Categories from Backend
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState<ExperienceLevel>("Intermediate level");
  const [salary, setSalary] = useState<number | string>("");
  const [vacancy, setVacancy] = useState<number | string>(1);
  const [jobType, setJobType] = useState<JobType>("Full-time");
  const [hiringStatus, setHiringStatus] = useState<"Ongoing" | "Closed">("Ongoing");
  const [deadline, setDeadline] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const deadlineDate = React.useMemo(() => {
    if (!deadline) return undefined;
    const [y, m, d] = deadline.split("-").map(Number);
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
  }, [deadline]);
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch active categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories({
          isActive: "true",
        });
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch (err: unknown) {
        console.error("Failed to load categories:", err);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();

    // Default deadline: 30 days from now (avoiding timezone offset issues)
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    const y = defaultDate.getFullYear();
    const m = String(defaultDate.getMonth() + 1).padStart(2, "0");
    const d = String(defaultDate.getDate()).padStart(2, "0");
    setDeadline(`${y}-${m}-${d}`);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError("Job title is required.");
      return;
    }

    if (!categoryId) {
      setFormError("Please select a job category.");
      return;
    }

    if (!location.trim()) {
      setFormError("Location is required.");
      return;
    }

    if (!salary || Number(salary) <= 0) {
      setFormError("Please enter a valid salary amount.");
      return;
    }

    if (!deadline) {
      setFormError("Application deadline is required.");
      return;
    }

    const meaningfulText = description
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .trim();

    if (!meaningfulText || meaningfulText.length < 20) {
      setFormError("Job description must contain at least 20 characters of readable text.");
      return;
    }

    setIsSubmitting(true);

    try {
      await recruiterService.createJob({
        title: title.trim(),
        categoryId,
        location: location.trim(),
        level,
        salary: Number(salary),
        vacancy: Number(vacancy) || 1,
        jobType,
        hiringStatus,
        deadline,
        description: description.trim(),
        visible,
      });

      toast.success("Job published successfully!", {
        description: `"${title}" is now open for candidate applications.`,
      });

      router.push("/recruiter/dashboard/manage-jobs");
    } catch (err: unknown) {
      let msg = "Failed to create job posting.";
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        msg = (err as { response: { data: { message: string } } }).response.data.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setFormError(msg);
      toast.error("Operation failed", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Published Job Vacancy
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Create an active job opening and match with qualified candidate talent.
          </p>
        </div>
      </div>

      {/* Form Error Alert */}
      {formError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
          <p className="font-medium">{formError}</p>
        </div>
      )}

      {/* Main Form Card */}
      <form id="add-job-form" onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-slate-200 shadow-xs">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Basic Position Details
            </h3>
            <p className="text-[11px] text-slate-500">
              Primary role information and category taxonomy.
            </p>
          </div>

          <CardContent className="p-6 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="job-title" className="text-xs font-semibold text-slate-700">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="job-title"
                type="text"
                placeholder="e.g. Senior Full-Stack Engineer, Product Designer, DevOps Architect"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                required
                className="text-xs"
              />
            </div>

            {/* Category & Job Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="job-category" className="text-xs font-semibold text-slate-700">
                  Job Category <span className="text-red-500">*</span>
                </Label>
                {isCategoriesLoading ? (
                  <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                ) : (
                  <Select
                    value={categoryId}
                    onValueChange={(val) => setCategoryId(val)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="job-category" className="h-11 text-xs">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-type" className="text-xs font-semibold text-slate-700">
                  Job Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={jobType}
                  onValueChange={(val) => setJobType(val as JobType)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="job-type" className="h-11 text-xs">
                    <SelectValue placeholder="Select Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location & Experience Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="job-location" className="text-xs font-semibold text-slate-700">
                  Location / City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="job-location"
                  type="text"
                  placeholder="e.g. San Francisco, CA or Remote (US)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-level" className="text-xs font-semibold text-slate-700">
                  Experience Level
                </Label>
                <Select
                  value={level}
                  onValueChange={(val) => setLevel(val as ExperienceLevel)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="job-level" className="h-11 text-xs">
                    <SelectValue placeholder="Select Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Salary, Vacancy, Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="job-salary" className="text-xs font-semibold text-slate-700">
                  Annual Salary ($ USD) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="job-salary"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="e.g. 120000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-vacancy" className="text-xs font-semibold text-slate-700">
                  Open Vacancies
                </Label>
                <Input
                  id="job-vacancy"
                  type="number"
                  min="1"
                  max="100"
                  value={vacancy}
                  onChange={(e) => setVacancy(e.target.value)}
                  disabled={isSubmitting}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-deadline" className="text-xs font-semibold text-slate-700">
                  Application Deadline <span className="text-red-500">*</span>
                </Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="job-deadline"
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      className={cn(
                        "h-11 w-full justify-start text-left text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 px-3 transition-colors",
                        !deadline && "text-slate-400 font-normal"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-400 shrink-0" />
                      {deadlineDate ? (
                        <span className="text-slate-900 font-semibold">
                          {deadlineDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      ) : (
                        <span>Select application deadline</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deadlineDate}
                      onSelect={(date) => {
                        if (date) {
                          const y = date.getFullYear();
                          const m = String(date.getMonth() + 1).padStart(2, "0");
                          const d = String(date.getDate()).padStart(2, "0");
                          setDeadline(`${y}-${m}-${d}`);
                        } else {
                          setDeadline("");
                        }
                        setIsCalendarOpen(false);
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Description Editor Card */}
        <Card className="border-slate-200 shadow-xs">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Role Description & Requirements
            </h3>
            <p className="text-[11px] text-slate-500">
              Provide thorough details about the responsibilities, required tech stack, and benefits.
            </p>
          </div>

          <CardContent className="p-6 space-y-3">
            <TiptapEditor
              value={description}
              onChange={setDescription}
              placeholder="Outline the responsibilities, required qualifications, key technologies, and workplace perks..."
              disabled={isSubmitting}
              error={
                formError && formError.toLowerCase().includes("description")
                  ? formError
                  : undefined
              }
            />
            <p className="text-[11px] text-slate-400">
              Format your job description using headings, lists, bold text, and links. Saved as clean, safe HTML.
            </p>
          </CardContent>
        </Card>

        {/* Publishing Options */}
        <Card className="border-slate-200 shadow-xs">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Publication Settings
            </h3>
            <p className="text-[11px] text-slate-500">
              Configure initial hiring status and public marketplace visibility.
            </p>
          </div>

          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Hiring Status
                </h4>
                <p className="text-[11px] text-slate-500">
                  Ongoing means the position actively accepts applications.
                </p>
              </div>

              <div className="w-32">
                <Select
                  value={hiringStatus}
                  onValueChange={(val) => setHiringStatus(val as "Ongoing" | "Closed")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Public Marketplace Visibility
                </h4>
                <p className="text-[11px] text-slate-500">
                  When enabled, this opening appears in search filters and the public catalogue.
                </p>
              </div>

              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                  disabled={isSubmitting}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/recruiter/dashboard/manage-jobs")}
            disabled={isSubmitting}
            className="text-xs"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs px-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Publishing Vacancy...
              </>
            ) : (
              <>
                <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                Publish Vacancy
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}


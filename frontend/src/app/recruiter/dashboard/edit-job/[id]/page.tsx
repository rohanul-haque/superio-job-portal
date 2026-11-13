"use client";

import TiptapEditor from "@/components/shared/TiptapEditor";
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
import categoryService from "@/services/category.service";
import jobService from "@/services/job.service";
import recruiterService from "@/services/recruiter.service";
import type { ICategory } from "@/types/category";
import type { ExperienceLevel, JobType } from "@/types/job";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Calendar as CalendarIcon,
  CheckCircle2,
  DollarSign,
  Layers,
  Loader2,
  MapPin,
  Pencil,
  Save,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

export default function RecruiterEditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<ICategory[]>([]);

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

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [categoriesData, jobData] = await Promise.all([
          categoryService.getAllCategories({ isActive: "true" }),
          jobService.getJobById(id),
        ]);

        setCategories(categoriesData);

        const currentJob = jobData.job;
        if (currentJob) {
          setTitle(currentJob.title || "");
          setCategoryId(currentJob.categoryId || "");
          setLocation(currentJob.location || "");
          setLevel(
            (currentJob.level as ExperienceLevel) || "Intermediate level",
          );
          setSalary(currentJob.salary || "");
          setVacancy(currentJob.vacancy || 1);
          setJobType((currentJob.jobType as JobType) || "Full-time");
          setHiringStatus(
            (currentJob.hiringStatus as "Ongoing" | "Closed") || "Ongoing",
          );
          if (currentJob.deadline) {
            const raw = currentJob.deadline;
            if (typeof raw === "string" && raw.includes("T")) {
              setDeadline(raw.split("T")[0]);
            } else {
              const d = new Date(raw);
              const y = d.getFullYear();
              const m = String(d.getMonth() + 1).padStart(2, "0");
              const day = String(d.getDate()).padStart(2, "0");
              setDeadline(`${y}-${m}-${day}`);
            }
          }
          setDescription(currentJob.description || "");
          setVisible(currentJob.visible !== false);
        }
      } catch (err: unknown) {
        let msg = "Failed to load job details for editing.";
        if (err instanceof Error) msg = err.message;
        setFormError(msg);
        toast.error("Error", { description: msg });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

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
      setFormError(
        "Job description must contain at least 20 characters of readable text.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await recruiterService.updateJob(id, {
        title: title.trim(),
        categoryId,
        location: location.trim(),
        level,
        salary: Number(salary),
        vacancy: Number(vacancy) || 1,
        jobType,
        hiringStatus,
        deadline,
        description, // Formatted HTML string preserved
        visible,
      });

      toast.success("Job updated successfully!", {
        description: `"${title}" modifications have been saved.`,
      });

      router.push("/recruiter/dashboard/manage-jobs");
    } catch (err: unknown) {
      let msg = "Failed to update job posting.";
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

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-xs text-slate-500 font-medium">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/recruiter/dashboard/manage-jobs">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 text-slate-600"
              title="Back to Manage Jobs"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Pencil className="h-5 w-5 text-indigo-600" />
              Edit Job Vacancy
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Update opening specifications, compensation, requirements, and HTML description.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          form="edit-job-form"
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Form Error Alert */}
      {formError && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Form */}
      <form id="edit-job-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Core Job Details */}
        <Card className="border-slate-200 shadow-xs">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Basic Information
            </h3>
            <p className="text-[11px] text-slate-500">
              Configure primary role credentials, category, and workspace location.
            </p>
          </div>

          <CardContent className="p-6 space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="job-title" className="text-xs font-bold text-slate-700">
                Job Title <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="job-title"
                  placeholder="e.g. Senior Full-Stack Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            {/* Category & Location Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="job-category" className="text-xs font-bold text-slate-700">
                  Job Category <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <Select
                    value={categoryId}
                    onValueChange={(val) => setCategoryId(val)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="job-category" className="h-10 text-xs font-semibold text-slate-700 pl-9">
                      <Layers className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
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
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-location" className="text-xs font-bold text-slate-700">
                  Office Location / Remote <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="job-location"
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="pl-9 text-xs"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Position Specifications & Compensation */}
        <Card className="border-slate-200 shadow-xs">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Employment & Compensation
            </h3>
            <p className="text-[11px] text-slate-500">
              Define seniority, job modality, headcount, and annual compensation.
            </p>
          </div>

          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Job Type */}
              <div className="space-y-1.5">
                <Label htmlFor="job-type" className="text-xs font-bold text-slate-700">
                  Employment Type
                </Label>
                <Select
                  value={jobType}
                  onValueChange={(val) => setJobType(val as JobType)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="job-type" className="h-10 text-xs font-semibold text-slate-700">
                    <SelectValue placeholder="Select Employment Type" />
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

              {/* Experience Level */}
              <div className="space-y-1.5">
                <Label htmlFor="job-level" className="text-xs font-bold text-slate-700">
                  Seniority Level
                </Label>
                <Select
                  value={level}
                  onValueChange={(val) => setLevel(val as ExperienceLevel)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="job-level" className="h-10 text-xs font-semibold text-slate-700">
                    <SelectValue placeholder="Select Seniority Level" />
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Annual Salary */}
              <div className="space-y-1.5">
                <Label htmlFor="job-salary" className="text-xs font-bold text-slate-700">
                  Annual Salary (USD) <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="job-salary"
                    type="number"
                    min={0}
                    placeholder="e.g. 120000"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              {/* Vacancy */}
              <div className="space-y-1.5">
                <Label htmlFor="job-vacancy" className="text-xs font-bold text-slate-700">
                  Open Vacancies
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="job-vacancy"
                    type="number"
                    min={1}
                    placeholder="1"
                    value={vacancy}
                    onChange={(e) => setVacancy(e.target.value)}
                    disabled={isSubmitting}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-1.5">
                <Label htmlFor="job-deadline" className="text-xs font-bold text-slate-700">
                  Application Deadline <span className="text-rose-500">*</span>
                </Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="job-deadline"
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      className={cn(
                        "h-10 w-full justify-start text-left text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 px-3 transition-colors",
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

        {/* Rich HTML Job Description (Tiptap) */}
        <Card className="border-slate-200 shadow-xs">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Role Responsibilities & Description <span className="text-rose-500">*</span>
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
              Configure hiring status and public marketplace visibility.
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
                <div className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-indigo-600 peer-focus:outline-none after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
              </label>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}


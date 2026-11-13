"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import candidateService from "@/services/candidate.service";
import type { ICandidateProfile } from "@/types/candidate";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Upload,
  User,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5 MB

export default function CandidateProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<ICandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");

  // Media upload state
  const imageInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await candidateService.getProfile();
      setProfile(data);
      setName(data.name || "");
      setTitle(data.title || "");
      setBio(data.bio || "");
      setSkills(data.skills || []);
      setLinkedin(data.socialLinks?.linkedin || "");
      setGithub(data.socialLinks?.github || "");
      setPortfolio(data.socialLinks?.portfolio || "");
      const activeImg =
        data.profilePicture?.url || user?.profilePicture?.url || null;
      setImagePreview(activeImg);
    } catch (err: unknown) {
      let msg = "Failed to load candidate profile.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Object URL cleanup
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Avatar Image Picker
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
        file.type,
      )
    ) {
      toast.error("Invalid format", {
        description: "Profile photo must be a JPG, PNG, or WEBP image.",
      });
      if (imageInputRef.current) imageInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("File size exceeded", {
        description: "Profile photo must be 5 MB or smaller.",
      });
      if (imageInputRef.current) imageInputRef.current.value = "";
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // PDF Resume Picker
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Invalid document", {
        description: "Resume must be a PDF document (.pdf).",
      });
      if (resumeInputRef.current) resumeInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_RESUME_SIZE) {
      toast.error("File size exceeded", {
        description: "Resume PDF must be 5 MB or smaller.",
      });
      if (resumeInputRef.current) resumeInputRef.current.value = "";
      return;
    }

    setSelectedResume(file);
    toast.success("PDF selected", {
      description: `${file.name} ready for upload. Click 'Save Profile' to submit.`,
    });
  };

  // Skill Tags Management
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.info("Skill already added");
      setSkillInput("");
      return;
    }
    setSkills([...skills, trimmed]);
    setSkillInput("");
  };

  const handleKeyDownSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("title", title.trim());
      formData.append("bio", bio.trim());
      formData.append("skills", JSON.stringify(skills));
      formData.append(
        "socialLinks",
        JSON.stringify({
          linkedin: linkedin.trim(),
          github: github.trim(),
          portfolio: portfolio.trim(),
        }),
      );

      if (selectedImage instanceof File) {
        formData.append("profilePicture", selectedImage);
      }

      if (selectedResume instanceof File) {
        formData.append("resume", selectedResume);
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("FormData entries:");
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(key, {
              name: value.name,
              type: value.type,
              size: value.size,
            });
          } else {
            console.log(key, value);
          }
        }
      }

      const updated = await candidateService.updateProfile(formData);
      setProfile(updated);
      setSelectedImage(null);
      setSelectedResume(null);
      const newImg = updated.profilePicture?.url || null;
      setImagePreview(newImg);

      // Refresh global AuthContext
      await refreshUser();

      toast.success("Profile saved successfully!", {
        description: "Your profile and resume have been updated.",
      });
    } catch (err: unknown) {
      let msg = "Failed to update profile.";
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message
      ) {
        msg = (err as { response: { data: { message: string } } }).response.data
          .message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error("Update failed", { description: msg });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-3 text-xs text-slate-500 font-medium">
          Loading profile data...
        </p>
      </div>
    );
  }

  const currentResumeUrl =
    (typeof profile?.resume === "object" && profile?.resume?.url
      ? profile.resume.url
      : typeof profile?.resume === "string"
        ? profile.resume
        : typeof user?.resume === "object" && user?.resume?.url
          ? user.resume.url
          : typeof user?.resume === "string"
            ? user.resume
            : "") || "";

  const getResumeFileName = () => {
    if (!currentResumeUrl || typeof currentResumeUrl !== "string") {
      return "Candidate_Resume.pdf";
    }
    try {
      const parts = currentResumeUrl.split("/");
      const last = parts[parts.length - 1];
      const decoded = decodeURIComponent(last);
      if (!decoded || decoded.includes("undefined") || decoded.includes("null")) {
        return "Candidate_Resume.pdf";
      }
      return decoded;
    } catch {
      return "Candidate_Resume.pdf";
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Title & Save Action */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            My Profile
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Keep your personal and professional profile information up to date.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchProfile}
            disabled={isSaving}
            className="h-9 px-3.5 text-xs font-semibold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Reload
          </Button>

          <Button
            type="submit"
            form="candidate-profile-form"
            disabled={isSaving}
            className="h-9 px-4 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <form
        id="candidate-profile-form"
        onSubmit={handleSaveProfile}
        className="space-y-6"
      >
        {/* RESUME MANAGEMENT SECTION (Resume Guard) */}
        <Card className="border-slate-200 shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    My Resume
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Enforcing the Superio Resume Guard: PDF resume required to
                    apply.
                  </p>
                </div>
              </div>

              {currentResumeUrl ? (
                <Badge
                  variant="outline"
                  data-testid="resume-activate"
                  aria-label="Resume Activate"
                  className="group inline-flex items-center gap-1 text-xs font-semibold rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 transition-colors duration-150 hover:bg-blue-600 hover:text-white hover:border-blue-600 cursor-default select-none shadow-none"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-700 transition-colors duration-150 group-hover:text-white" />
                  <span className="text-emerald-700 transition-colors duration-150 group-hover:text-white">
                    Resume Active
                  </span>
                  <span className="sr-only">Resume Activate</span>
                </Badge>
              ) : (
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs gap-1 font-semibold">
                  <AlertCircle className="h-3.5 w-3.5" />
                  No Resume
                </Badge>
              )}
            </div>
          </div>

          <CardContent className="p-6 space-y-4">
            {/* Hidden file input */}
            <input
              ref={resumeInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleResumeChange}
              disabled={isSaving}
              className="hidden"
              id="resume-file-input"
            />

            {/* Current Resume Display or Empty State */}
            {currentResumeUrl ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {getResumeFileName()}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Verified PDF Resume Document
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                  <a
                    href={currentResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition shrink-0"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                    <span>View/Open Resume</span>
                  </a>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={isSaving}
                    className="h-9 px-3.5 text-xs font-semibold rounded-xl border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition shrink-0"
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                    <span>Replace Resume</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-7 sm:p-9 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-xs">
                  <FileText className="h-6 w-6" />
                </div>
                <h4 className="mt-3.5 text-sm font-bold text-slate-900">
                  You have no resume yet.
                </h4>
                <p className="mt-1.5 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Please upload your resume to get started and make your profile ready for recruiters.
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => resumeInputRef.current?.click()}
                  disabled={isSaving}
                  className="mt-4 h-9 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  Upload Resume
                </Button>
              </div>
            )}

            {/* Pending file selected notice */}
            {selectedResume && (
              <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">{selectedResume.name}</span>
                  <span className="text-blue-500">
                    ({(selectedResume.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedResume(null)}
                  className="rounded p-1 hover:bg-blue-100 text-blue-600"
                  title="Cancel selection"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PERSONAL & PROFESSIONAL INFO */}
        <Card className="border-slate-200 shadow-xs">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Personal Information
            </h3>
            <p className="text-[11px] text-slate-500">
              Your identity, professional title, and background overview.
            </p>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Avatar Photo Upload */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleImageChange}
                disabled={isSaving}
                className="hidden"
                id="avatar-image-input"
              />

              <Avatar className="h-20 w-20 shrink-0 rounded-2xl border-2 border-slate-200">
                <AvatarImage
                  src={imagePreview || undefined}
                  alt={name || "Profile"}
                  className="rounded-2xl object-cover"
                />
                <AvatarFallback className="rounded-2xl bg-blue-50 text-blue-700 font-bold text-xl flex items-center justify-center">
                  {name ? (
                    name.charAt(0).toUpperCase()
                  ) : (
                    <User className="h-8 w-8 text-slate-400" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  Profile Photo
                </h4>
                <p className="text-[11px] text-slate-500">
                  JPEG, JPG, PNG, or WEBP up to 5 MB. Appears on your
                  applications.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isSaving}
                    className="h-8 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <Camera className="mr-1.5 h-3.5 w-3.5" />
                    {imagePreview ? "Change Photo" : "Upload Photo"}
                  </Button>
                  {selectedImage && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedImage(null);
                        const activeImg =
                          profile?.profilePicture?.url ||
                          user?.profilePicture?.url ||
                          null;
                        setImagePreview(activeImg);
                      }}
                      disabled={isSaving}
                      className="h-8 text-xs text-red-600 hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Inputs: Name, Title, Email */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="candidate-name"
                  className="text-xs font-semibold text-slate-700"
                >
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="candidate-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSaving}
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="candidate-email"
                  className="text-xs font-semibold text-slate-700"
                >
                  Email Address (Read-only)
                </Label>
                <Input
                  id="candidate-email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-slate-50 text-slate-500 text-xs cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label
                  htmlFor="candidate-title"
                  className="text-xs font-semibold text-slate-700"
                >
                  Professional Title
                </Label>
                <Input
                  id="candidate-title"
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer, Full Stack Developer, Product Designer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSaving}
                  className="text-xs"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label
                  htmlFor="candidate-bio"
                  className="text-xs font-semibold text-slate-700"
                >
                  About / Bio
                </Label>
                <textarea
                  id="candidate-bio"
                  rows={4}
                  placeholder="Brief summary of your professional journey, technical expertise, and career aspirations..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={isSaving}
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-900 transition placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SKILLS TAGS SECTION */}
        <Card className="border-slate-200 shadow-xs">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Skills & Expertise
            </h3>
            <p className="text-[11px] text-slate-500">
              Add technical skills to highlight your strengths to employers.
            </p>
          </div>

          <CardContent className="p-6 space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type a skill (e.g. React, Next.js, Node.js) and press Enter..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDownSkill}
                disabled={isSaving}
                className="text-xs"
              />
              <Button
                type="button"
                onClick={handleAddSkill}
                disabled={isSaving || !skillInput.trim()}
                className="text-xs bg-slate-900 text-white hover:bg-slate-800"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No skills added yet. Type a skill above and click Add.
                </p>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      disabled={isSaving}
                      className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* SOCIAL & PORTFOLIO LINKS */}
        <Card className="border-slate-200 shadow-xs">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Social Media & Portfolio Links
            </h3>
            <p className="text-[11px] text-slate-500">
              Include links to your online presence, code repositories, and
              personal portfolio.
            </p>
          </div>

          <CardContent className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="link-linkedin"
                className="text-xs font-semibold text-slate-700"
              >
                LinkedIn Profile
              </Label>
              <Input
                id="link-linkedin"
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                disabled={isSaving}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="link-github"
                className="text-xs font-semibold text-slate-700"
              >
                GitHub Profile
              </Label>
              <Input
                id="link-github"
                type="url"
                placeholder="https://github.com/username"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                disabled={isSaving}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="link-portfolio"
                className="text-xs font-semibold text-slate-700"
              >
                Portfolio Website
              </Label>
              <Input
                id="link-portfolio"
                type="url"
                placeholder="https://yourportfolio.com"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                disabled={isSaving}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Changes Floating Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-9 px-5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

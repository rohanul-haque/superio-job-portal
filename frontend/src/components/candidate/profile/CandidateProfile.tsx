"use client";

import { ProfileForm } from "./ProfileForm";
import { ProfileInformation } from "./ProfileInformation";
import { ProfileSkeleton } from "@/components/loaders/skeleton/ProfileSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
import type { ICandidateProfile } from "@/interfaces/candidate.interface";
import candidateService from "@/services/candidate.service";
import { AlertCircle, RefreshCw } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5 MB

export function CandidateProfile() {
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
  }, [user?.profilePicture?.url]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Invalid file format", {
        description: "Resume must be an authentic PDF document.",
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
  };

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      toast.info("Skill already added");
      return;
    }
    setSkills([...skills, trimmed]);
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("title", title.trim());
      formData.append("bio", bio.trim());
      formData.append(
        "socialLinks",
        JSON.stringify({
          linkedin: linkedin.trim() || undefined,
          github: github.trim() || undefined,
          portfolio: portfolio.trim() || undefined,
        }),
      );
      formData.append("skills", JSON.stringify(skills));

      if (selectedImage) {
        formData.append("profilePicture", selectedImage);
      }

      if (selectedResume) {
        formData.append("resume", selectedResume);
      }

      const updated = await candidateService.updateProfile(formData);
      setProfile(updated);
      setSelectedImage(null);
      setSelectedResume(null);

      await refreshUser();
      toast.success("Profile saved", {
        description: "Your candidate profile and credentials have been updated.",
      });
    } catch (err: unknown) {
      let msg = "Failed to update profile.";
      if (err instanceof Error) msg = err.message;
      toast.error("Save error", { description: msg });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Candidate Profile
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Manage your personal credentials, resume, skills, and portfolio
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchProfile}
          disabled={isLoading}
          className="text-xs border-slate-200 self-start sm:self-auto"
        >
          {isLoading ? (
            <Spinner size="sm" className="mr-1.5" />
          ) : (
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          )}
          Refresh
        </Button>
      </div>

      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-6 sm:p-8">
          <ProfileInformation
            name={name}
            imagePreview={imagePreview}
            fileInputRef={imageInputRef}
            onImageChange={handleImageChange}
            isSaving={isSaving}
          />

          <ProfileForm
            name={name}
            setName={setName}
            title={title}
            setTitle={setTitle}
            bio={bio}
            setBio={setBio}
            skills={skills}
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
            linkedin={linkedin}
            setLinkedin={setLinkedin}
            github={github}
            setGithub={setGithub}
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            profile={profile}
            selectedResume={selectedResume}
            resumeInputRef={resumeInputRef}
            onResumeChange={handleResumeChange}
            onRemoveSelectedResume={() => setSelectedResume(null)}
            isSaving={isSaving}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default CandidateProfile;

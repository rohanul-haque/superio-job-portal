"use client";

import { CompanyProfileForm } from "./CompanyProfileForm";
import { ProfileSkeleton } from "@/components/loaders/skeleton/ProfileSkeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import type { ICompanyProfile } from "@/interfaces/recruiter.interface";
import { getProfile, updateProfile } from "@/services/recruiter.service";
import { RefreshCw } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export function CompanyProfile() {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState<ICompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");

  // Logo upload state
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProfile();
      setProfile(data);
      setName(data.name || "");
      setDescription(data.description || "");
      setWebsite(data.website || "");
      setLocation(data.location || "");
      setCompanySize(data.companySize || "");
      setLinkedin(data.socialLinks?.linkedin || "");
      setGithub(data.socialLinks?.github || "");
      setTwitter(data.socialLinks?.twitter || "");
      setFacebook(data.socialLinks?.facebook || "");
      setLogoPreview(data.image || null);
    } catch (err: unknown) {
      let msg = "Failed to load company profile.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)
    ) {
      toast.error("Invalid Format", {
        description: "Company logo must be a JPG, PNG, or WEBP image file.",
      });
      if (logoInputRef.current) logoInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("File Size Exceeded", {
        description: "Logo image must be 5 MB or smaller.",
      });
      if (logoInputRef.current) logoInputRef.current.value = "";
      return;
    }

    setSelectedLogo(file);
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    toast.success("Logo Selected", {
      description: `${file.name} ready for Cloudinary upload. Click 'Save Changes' to update.`,
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Validation Error", {
        description: "Company name is required.",
      });
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("website", website.trim());
      formData.append("location", location.trim());
      formData.append("companySize", companySize.trim());
      formData.append(
        "socialLinks",
        JSON.stringify({
          linkedin: linkedin.trim(),
          github: github.trim(),
          twitter: twitter.trim(),
          facebook: facebook.trim(),
        })
      );

      if (selectedLogo) {
        formData.append("image", selectedLogo);
      }

      const updated = await updateProfile(formData);
      setProfile(updated);
      setSelectedLogo(null);
      setLogoPreview(updated.image || null);

      await refreshUser();

      toast.success("Profile Updated", {
        description: "Company brand profile and credentials saved successfully.",
      });
    } catch (err: unknown) {
      let msg = "Failed to update company profile.";
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
      toast.error("Update Failed", { description: msg });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Company Profile & Branding
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Maintain your enterprise brand identity, headquarters info, logo,
            and public presence.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchProfile}
          disabled={isLoading || isSaving}
          className="gap-2 self-start sm:self-auto border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Reload Info
        </Button>
      </div>

      <CompanyProfileForm
        profile={profile}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        website={website}
        setWebsite={setWebsite}
        location={location}
        setLocation={setLocation}
        companySize={companySize}
        setCompanySize={setCompanySize}
        linkedin={linkedin}
        setLinkedin={setLinkedin}
        github={github}
        setGithub={setGithub}
        twitter={twitter}
        setTwitter={setTwitter}
        facebook={facebook}
        setFacebook={setFacebook}
        logoPreview={logoPreview}
        selectedLogo={selectedLogo}
        logoInputRef={logoInputRef}
        onLogoChange={handleLogoChange}
        isSaving={isSaving}
        onSave={handleSaveProfile}
      />
    </div>
  );
}

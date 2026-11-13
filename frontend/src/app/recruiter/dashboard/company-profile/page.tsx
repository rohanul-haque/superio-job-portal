"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import recruiterService from "@/services/recruiter.service";
import type { ICompanyProfile } from "@/types/recruiter";
import {
  Building2,
  Camera,
  CheckCircle2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  RefreshCw,
  Save,
  Upload,
  Users,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const COMPANY_SIZE_OPTIONS = [
  "1-10 Employees",
  "11-50 Employees",
  "51-200 Employees",
  "201-500 Employees",
  "501-1000 Employees",
  "1000+ Employees",
];

export default function RecruiterCompanyProfilePage() {
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
      const data = await recruiterService.getProfile();
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

  // Object URL cleanup for preview
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  // Logo picker change handler
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
        file.type,
      )
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

  // Submit profile changes
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
        }),
      );

      if (selectedLogo) {
        formData.append("image", selectedLogo);
      }

      const updated = await recruiterService.updateProfile(formData);
      setProfile(updated);
      setSelectedLogo(null);
      setLogoPreview(updated.image || null);

      // Refresh auth state across application
      await refreshUser();

      toast.success("Profile Updated", {
        description:
          "Company brand profile and credentials saved successfully.",
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
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="h-9 w-9 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-medium text-slate-600">
          Loading company profile...
        </p>
      </div>
    );
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

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Brand Logo & Basic Identity Card */}
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-6 sm:p-7">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600" />
              Company Logo & Identity
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
              {/* Logo Preview */}
              <div className="relative group">
                <div className="flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 shadow-inner">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Company Logo Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-10 w-10 text-slate-400" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition"
                  title="Upload New Logo"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Upload Actions & Help Text */}
              <div className="space-y-2 text-center sm:text-left flex-1">
                <h3 className="text-sm font-bold text-slate-900">Brand Logo</h3>
                <p className="text-xs text-slate-500 max-w-md">
                  Upload your organization logo to display on job postings,
                  candidate applications, and company badges. JPG, PNG or WEBP
                  up to 5 MB.
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                    className="gap-2 rounded-xl text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {selectedLogo ? "Replace Selected File" : "Upload Logo"}
                  </Button>

                  {selectedLogo && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {selectedLogo.name}
                    </span>
                  )}
                </div>

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Basic Info Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
              <div className="space-y-2">
                <Label
                  htmlFor="companyName"
                  className="text-xs font-bold text-slate-700"
                >
                  Company Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Technologies Inc."
                  required
                  className="rounded-xl border-slate-200 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="companyEmail"
                  className="text-xs font-bold text-slate-700"
                >
                  Account Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="companyEmail"
                    value={profile?.email || ""}
                    disabled
                    className="pl-10 rounded-xl border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="companyWebsite"
                  className="text-xs font-bold text-slate-700"
                >
                  Website URL
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="companyWebsite"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://acme.example.com"
                    className="pl-10 rounded-xl border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="companyLocation"
                  className="text-xs font-bold text-slate-700"
                >
                  Headquarters / Primary Location
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="companyLocation"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA or Remote"
                    className="pl-10 rounded-xl border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="companySize"
                  className="text-xs font-bold text-slate-700"
                >
                  Organization Size
                </Label>
                <div className="relative">
                  <Select
                    value={companySize}
                    onValueChange={(val) => setCompanySize(val)}
                  >
                    <SelectTrigger id="companySize" className="h-10 rounded-xl border-slate-200 text-sm pl-10">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <SelectValue placeholder="Select company size..." />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Overview Card */}
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-6 sm:p-7 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                About the Company
              </h2>
              <p className="text-xs text-slate-500">
                Provide a compelling mission statement, culture overview, and
                work environment summary.
              </p>
            </div>

            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell candidates about your company culture, core values, milestones, and why talented people should join your team..."
              className="w-full rounded-2xl border border-slate-200 p-4 text-sm text-slate-800 focus:border-indigo-500 focus:outline-hidden resize-y"
            />
          </CardContent>
        </Card>

        {/* Social Media Links Card */}
        <Card className="border-slate-200 shadow-xs">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Social Media Links
            </h3>
            <p className="text-[11px] text-slate-500">
              Connect your organization profiles to enhance candidate trust and
              outreach.
            </p>
          </div>

          <CardContent className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="link-linkedin"
                className="text-xs font-semibold text-slate-700"
              >
                LinkedIn Company Page
              </Label>
              <Input
                id="link-linkedin"
                type="url"
                placeholder="https://linkedin.com/company/acme"
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
                GitHub Organization
              </Label>
              <Input
                id="link-github"
                type="url"
                placeholder="https://github.com/acme"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                disabled={isSaving}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="link-twitter"
                className="text-xs font-semibold text-slate-700"
              >
                Twitter / X Profile
              </Label>
              <Input
                id="link-twitter"
                type="url"
                placeholder="https://x.com/acme"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                disabled={isSaving}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="link-facebook"
                className="text-xs font-semibold text-slate-700"
              >
                Facebook Page
              </Label>
              <Input
                id="link-facebook"
                type="url"
                placeholder="https://facebook.com/acme"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                disabled={isSaving}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            className="gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

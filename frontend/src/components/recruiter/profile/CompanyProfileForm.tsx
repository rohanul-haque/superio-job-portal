import CompanyLogoUpload from "./CompanyLogoUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import type { ICompanyProfile } from "@/interfaces/recruiter.interface";
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Save,
  Users,
} from "lucide-react";
import React from "react";

const COMPANY_SIZE_OPTIONS = [
  "1-10 Employees",
  "11-50 Employees",
  "51-200 Employees",
  "201-500 Employees",
  "501-1000 Employees",
  "1000+ Employees",
];

interface CompanyProfileFormProps {
  profile: ICompanyProfile | null;
  name: string;
  setName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  website: string;
  setWebsite: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  companySize: string;
  setCompanySize: (v: string) => void;
  linkedin: string;
  setLinkedin: (v: string) => void;
  github: string;
  setGithub: (v: string) => void;
  twitter: string;
  setTwitter: (v: string) => void;
  facebook: string;
  setFacebook: (v: string) => void;
  logoPreview: string | null;
  selectedLogo: File | null;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSaving: boolean;
  onSave: (e: React.FormEvent) => void;
}

export default function CompanyProfileForm({
  profile,
  name,
  setName,
  description,
  setDescription,
  website,
  setWebsite,
  location,
  setLocation,
  companySize,
  setCompanySize,
  linkedin,
  setLinkedin,
  github,
  setGithub,
  twitter,
  setTwitter,
  facebook,
  setFacebook,
  logoPreview,
  selectedLogo,
  logoInputRef,
  onLogoChange,
  isSaving,
  onSave,
}: CompanyProfileFormProps) {
  return (
    <form onSubmit={onSave} className="space-y-6">
      {/* Brand Logo & Basic Identity Card */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-6 sm:p-7">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            Company Logo & Identity
          </h2>

          <CompanyLogoUpload
            logoPreview={logoPreview}
            selectedLogo={selectedLogo}
            logoInputRef={logoInputRef}
            onLogoChange={onLogoChange}
          />

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
                  <SelectTrigger
                    id="companySize"
                    className="h-10 rounded-xl border-slate-200 text-sm pl-10"
                  >
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
              Provide a compelling mission statement, culture overview, and work
              environment summary.
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
              <Spinner size="sm" className="mr-2" />
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
  );
}

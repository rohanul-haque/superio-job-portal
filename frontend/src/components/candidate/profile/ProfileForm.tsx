import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import type { ICandidateProfile } from "@/interfaces/candidate.interface";
import {
  AlertCircle,
  ExternalLink,
  FileText,
  Plus,
  Save,
  Upload,
  User,
  X,
} from "lucide-react";
import React, { type RefObject } from "react";

interface ProfileFormProps {
  name: string;
  setName: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
  skills: string[];
  skillInput: string;
  setSkillInput: (v: string) => void;
  onAddSkill: (e?: React.FormEvent) => void;
  onRemoveSkill: (skill: string) => void;
  linkedin: string;
  setLinkedin: (v: string) => void;
  github: string;
  setGithub: (v: string) => void;
  portfolio: string;
  setPortfolio: (v: string) => void;
  profile: ICandidateProfile | null;
  selectedResume: File | null;
  resumeInputRef: RefObject<HTMLInputElement | null>;
  onResumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveSelectedResume: () => void;
  isSaving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

function ProfileForm({
  name,
  setName,
  title,
  setTitle,
  bio,
  setBio,
  skills,
  skillInput,
  setSkillInput,
  onAddSkill,
  onRemoveSkill,
  linkedin,
  setLinkedin,
  github,
  setGithub,
  portfolio,
  setPortfolio,
  profile,
  selectedResume,
  resumeInputRef,
  onResumeChange,
  onRemoveSelectedResume,
  isSaving,
  onSubmit,
}: ProfileFormProps) {
  const existingResumeUrl =
    typeof profile?.resume === "object"
      ? profile?.resume?.url
      : profile?.resume;

  return (
    <form onSubmit={onSubmit} className="space-y-8 pt-4">
      {/* Basic Profile Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="candidate-name" className="text-xs font-bold text-slate-700">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="candidate-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="pl-10 h-10 text-xs sm:text-sm"
              required
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="candidate-title" className="text-xs font-bold text-slate-700">
            Professional Title / Role
          </Label>
          <Input
            id="candidate-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer"
            className="h-10 text-xs sm:text-sm"
            disabled={isSaving}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="candidate-bio" className="text-xs font-bold text-slate-700">
            Professional Bio & Summary
          </Label>
          <textarea
            id="candidate-bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Briefly describe your background, career focus, and major accomplishments..."
            className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Skills Manager */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div>
          <Label className="text-xs font-bold text-slate-700">
            Technical & Professional Skills
          </Label>
          <p className="text-[11px] text-slate-400">
            Type a skill and press Enter or click Add (e.g. React, Node.js, TypeScript, PostgreSQL)
          </p>
        </div>

        <div className="flex gap-2 max-w-md">
          <Input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddSkill();
              }
            }}
            placeholder="Add a core skill..."
            className="h-9 text-xs"
            disabled={isSaving}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAddSkill()}
            disabled={isSaving || !skillInput.trim()}
            className="text-xs border-slate-200"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 flex items-center gap-1.5"
            >
              {skill}
              <button
                type="button"
                onClick={() => onRemoveSkill(skill)}
                disabled={isSaving}
                className="text-slate-400 hover:text-red-600 transition"
                title={`Remove ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {skills.length === 0 && (
            <p className="text-xs text-slate-400 italic">No skills added yet.</p>
          )}
        </div>
      </div>

      {/* Social & Portfolio Links */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div>
          <Label className="text-xs font-bold text-slate-700">
            Social Profiles & Portfolio
          </Label>
          <p className="text-[11px] text-slate-400">
            Add links to showcase your projects and professional network to employers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="link-linkedin" className="text-[11px] font-semibold text-slate-600">
              LinkedIn Profile
            </Label>
            <Input
              id="link-linkedin"
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="h-9 text-xs"
              disabled={isSaving}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="link-github" className="text-[11px] font-semibold text-slate-600">
              GitHub Profile
            </Label>
            <Input
              id="link-github"
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/username"
              className="h-9 text-xs"
              disabled={isSaving}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="link-portfolio" className="text-[11px] font-semibold text-slate-600">
              Personal Portfolio
            </Label>
            <Input
              id="link-portfolio"
              type="url"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="https://yourportfolio.dev"
              className="h-9 text-xs"
              disabled={isSaving}
            />
          </div>
        </div>
      </div>

      {/* Resume Guard & PDF Resume Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Label className="text-xs font-bold text-slate-700">
              Curriculum Vitae / PDF Resume
            </Label>
            <Badge className="bg-blue-100 text-blue-700 border-none text-[10px] font-semibold">
              Resume Guard Guarded
            </Badge>
          </div>
          <p className="text-[11px] text-slate-400">
            Superio requires a verified PDF resume on file to unlock the &quot;Apply Now&quot; button across all employer postings.
          </p>
        </div>

        <input
          ref={resumeInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={onResumeChange}
        />

        {existingResumeUrl && !selectedResume && (
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Active PDF Resume on File
                </p>
                <p className="text-[11px] text-slate-500">
                  Verified and unlocked for one-click job applications
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={existingResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                View PDF
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => resumeInputRef.current?.click()}
                disabled={isSaving}
                className="text-xs border-slate-200"
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Replace
              </Button>
            </div>
          </div>
        )}

        {selectedResume && (
          <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {selectedResume.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  {(selectedResume.size / (1024 * 1024)).toFixed(2)} MB • Ready to save
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemoveSelectedResume}
              disabled={isSaving}
              className="text-xs text-red-600 hover:bg-red-50"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Cancel Upload
            </Button>
          </div>
        )}

        {!existingResumeUrl && !selectedResume && (
          <div
            onClick={() => resumeInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center hover:bg-slate-50 hover:border-blue-400 cursor-pointer transition"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs text-blue-600 mb-3">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-slate-800">
              Click to select your PDF Resume
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              PDF documents only, maximum file size 5 MB
            </p>
          </div>
        )}
      </div>

      {/* Form Submission Actions */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 h-10"
        >
          {isSaving ? (
            <>
              <Spinner size="sm" className="mr-1.5" />
              Saving Profile...
            </>
          ) : (
            <>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save Profile Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default ProfileForm;

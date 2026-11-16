import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import type { IAdminProfile } from "@/interfaces/admin.interface";
import { CheckCircle2, Mail, Save, ShieldCheck, User } from "lucide-react";
import React from "react";

interface AdminProfileFormProps {
  profile: IAdminProfile;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  isUpdatingProfile: boolean;
  hasProfileChanges: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AdminProfileForm({
  profile,
  name,
  setName,
  email,
  setEmail,
  isUpdatingProfile,
  hasProfileChanges,
  onSubmit,
}: AdminProfileFormProps) {
  return (
    <Card className="border border-slate-200 shadow-xs bg-white overflow-hidden">
      <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
            <User className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              Personal Information
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Update your primary administrator account name and contact email
              address.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label
                htmlFor="admin-name"
                className="text-xs font-bold text-slate-700"
              >
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="admin-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Super Admin"
                  className="pl-9 text-xs sm:text-sm h-10 border-slate-200 focus-visible:ring-purple-500"
                  required
                  disabled={isUpdatingProfile}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <Label
                htmlFor="admin-email"
                className="text-xs font-bold text-slate-700"
              >
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@superio.com"
                  className="pl-9 text-xs sm:text-sm h-10 border-slate-200 focus-visible:ring-purple-500"
                  required
                  disabled={isUpdatingProfile}
                />
              </div>
            </div>
          </div>

          {/* Account Details Badges / Info */}
          <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-slate-700">Account Role:</span>
              <Badge className="bg-purple-100 text-purple-700 border-none px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                {profile.role}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Status:</span>
              <Badge className="bg-emerald-100 text-emerald-700 border-none px-2 py-0.5 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {profile.status === "active" ? "Active" : profile.status}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Email Verified:</span>
              <Badge className="bg-blue-100 text-blue-700 border-none px-2 py-0.5 text-[11px] font-semibold">
                {profile.isEmailVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50/60 border-t border-slate-100 px-6 py-3 flex items-center justify-end">
          <Button
            type="submit"
            disabled={isUpdatingProfile || !hasProfileChanges}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs min-w-[130px]"
          >
            {isUpdatingProfile ? (
              <>
                <Spinner size="sm" className="mr-1.5" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Update Profile
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

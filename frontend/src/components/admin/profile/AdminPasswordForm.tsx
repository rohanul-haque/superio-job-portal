import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import React, { useState } from "react";

export interface AdminPasswordFormProps {
  currentPassword: string;
  setCurrentPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  isChangingPassword: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminPasswordForm({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isChangingPassword,
  onSubmit,
}: AdminPasswordFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Card className="border border-slate-200 shadow-xs bg-white overflow-hidden">
      <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              Change Password
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Ensure your administrative account remains protected with a
              strong, secure password.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className="p-6 space-y-5">
          {/* Current Password */}
          <div className="space-y-2 max-w-md">
            <Label
              htmlFor="current-password"
              className="text-xs font-bold text-slate-700"
            >
              Current Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="pl-9 pr-10 text-xs sm:text-sm h-10 border-slate-200 focus-visible:ring-amber-500"
                required
                disabled={isChangingPassword}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            {/* New Password */}
            <div className="space-y-2">
              <Label
                htmlFor="new-password"
                className="text-xs font-bold text-slate-700"
              >
                New Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="pl-9 pr-10 text-xs sm:text-sm h-10 border-slate-200 focus-visible:ring-amber-500"
                  required
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Minimum 6 characters. Use letters, numbers, and symbols for best
                security.
              </p>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="text-xs font-bold text-slate-700"
              >
                Confirm New Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="pl-9 pr-10 text-xs sm:text-sm h-10 border-slate-200 focus-visible:ring-amber-500"
                  required
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50/60 border-t border-slate-100 px-6 py-3 flex items-center justify-end">
          <Button
            type="submit"
            disabled={
              isChangingPassword ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword
            }
            className="gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs min-w-[140px]"
          >
            {isChangingPassword ? (
              <>
                <Spinner size="sm" className="mr-1.5" />
                Updating...
              </>
            ) : (
              <>
                <KeyRound className="h-3.5 w-3.5" />
                Change Password
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

"use client";

import EmailVerificationModal from "@/components/auth/EmailVerificationModal";
import RoleSelector, { RoleType } from "@/components/auth/RoleSelector";
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
import { authService } from "@/services/auth.service";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface RegisterFormProps {
  initialRole?: RoleType;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  initialRole = "candidate",
}) => {
  const searchParams = useSearchParams();
  const queryRole = searchParams.get("role") as RoleType | null;

  const [selectedRole, setSelectedRole] = useState<RoleType>(
    queryRole === "recruiter" || queryRole === "candidate"
      ? queryRole
      : initialRole,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (name.trim().length < 2) {
      setErrorMessage("Name must be at least 2 characters long.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    const targetEmail = email.trim();

    try {
      if (selectedRole === "candidate") {
        await authService.registerCandidate({
          name: name.trim(),
          email: targetEmail,
          password,
        });
      } else {
        await authService.registerRecruiter({
          name: name.trim(),
          email: targetEmail,
          password,
        });
      }

      setRegisteredEmail(targetEmail);
      setName("");
      setEmail("");
      setPassword("");
      setIsSuccess(true);
      toast.success(
        "Account created! Please check your email to complete verification.",
      );
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(
        error.message || "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <EmailVerificationModal
        isOpen={isSuccess}
        onClose={() => setIsSuccess(false)}
        mode="registration"
        email={registeredEmail}
      />

      <Card className="border border-slate-200/80 shadow-xl shadow-slate-200/50">
      <CardHeader className="space-y-4 text-center pb-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-8 ring-blue-50/50">
          <UserPlus className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Create an Account
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Join Superio Enterprise as a {selectedRole === "recruiter" ? "Recruiter" : "Candidate"}
          </CardDescription>
        </div>

        {/* Reference Role Selector Toggle */}
        <RoleSelector
          selectedRole={selectedRole}
          onChange={(role) => {
            setSelectedRole(role);
            setErrorMessage(null);
          }}
          className="mt-2"
        />
      </CardHeader>

      <CardContent>
        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <p className="font-semibold text-xs flex-1">{errorMessage}</p>
          </div>
        )}

        {/* Form containing ONLY Name, Email, Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-name">
              {selectedRole === "recruiter" ? "Company / Full Name" : "Full Name"}
            </Label>
            <Input
              id="register-name"
              type="text"
              placeholder={selectedRole === "recruiter" ? "Acme Corporation" : "John Doe"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email">
              {selectedRole === "recruiter" ? "Work Email Address" : "Email Address"}
            </Label>
            <Input
              id="register-email"
              type="email"
              placeholder={selectedRole === "recruiter" ? "hr@company.com" : "john@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <div className="relative">
              <Input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create {selectedRole === "recruiter" ? "Recruiter" : "Candidate"} Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 p-6 text-center text-sm text-slate-600">
        <p>
          Already have an account?{" "}
          <Link
            href={`/login?role=${selectedRole}`}
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
    </>
  );
};

export default RegisterForm;


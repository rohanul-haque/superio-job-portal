'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/shared/Logo';
import { KeyRound, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Password reset instructions dispatched to your email.');
  };

  return (
    <Card className="rounded-2xl border border-[#E5E7EB] bg-white shadow-none">
      <CardHeader className="space-y-4 text-center pb-6">
        <div className="flex justify-center pb-1">
          <Logo href="/" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Reset Password
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Enter your registered email address to receive password reset instructions
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {submitted ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-800">
            <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-600" />
            <p className="font-semibold">Reset instructions sent!</p>
            <p className="mt-1 text-xs text-emerald-700">
              If an account with <strong>{email}</strong> exists, you will receive instructions shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-[#0F172A]">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border-[#E5E7EB] text-sm"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-full font-semibold h-11"
            >
              Send Reset Link
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center border-t border-[#E5E7EB] bg-slate-50/50 p-6 text-sm text-slate-600 rounded-b-2xl">
        <Link href="/login" className="flex items-center gap-1.5 font-medium hover:text-[#4F46E5] transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}

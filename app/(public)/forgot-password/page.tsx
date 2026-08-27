"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            ad<span className="text-teal-600 dark:text-teal-400">AIPROMORA</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Reset your password
        </h2>
        <p className="text-xs text-slate-500">
          Enter your verified email to receive recovery instructions.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-6 sm:p-8 space-y-5 text-xs">
            {submitted ? (
              <div className="text-center space-y-3 py-4 animate-in fade-in">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Password reset link sent!
                </h3>
                <p className="text-slate-500">
                  Check your inbox for <strong>{email}</strong> for instructions to reset your password.
                </p>
                <div className="pt-2">
                  <Link href="/login">
                    <Button variant="outline" className="h-9 text-xs">
                      Back to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Email address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="karan@company.in"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <Button type="submit" className="w-full h-11 text-xs font-bold bg-teal-700 hover:bg-teal-800">
                  Send Recovery Link
                </Button>

                <div className="text-center pt-2">
                  <Link href="/login" className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                    <ArrowLeft className="h-3 w-3" /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, LayoutDashboard, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("adAIPROMORA Application Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100">
      {/* Top Navbar Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            ad<span className="text-teal-600 dark:text-teal-400">AIPROMORA</span>
          </span>
        </Link>
      </div>

      {/* Error Card Container */}
      <div className="max-w-md mx-auto w-full text-center space-y-6 my-auto py-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 shadow-lg">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Something unexpected occurred
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Our AI engine caught an unexpected application exception. You can safely retry or return to your marketing dashboard.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 text-left overflow-x-auto max-h-24">
            <code>{error.message}</code>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            variant="default"
            size="sm"
            className="text-xs font-bold gap-1.5 bg-teal-700 hover:bg-teal-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </Button>
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold gap-1.5"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Go to Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-[11px] text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center justify-between">
        <span>ad<strong className="text-teal-600 dark:text-teal-400">AIPROMORA</strong> Diagnostics</span>
        <span>Developed by <strong>Satkuri Kailash</strong></span>
      </div>
    </div>
  );
}

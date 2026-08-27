"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Home,
  LayoutDashboard,
  FileText,
  Search,
  ArrowRight,
  HelpCircle,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
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
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5">
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Button>
        </Link>
      </div>

      {/* Main 404 Hero Container */}
      <div className="max-w-xl mx-auto w-full text-center space-y-6 my-auto py-8">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-teal-500/20 to-indigo-500/20 border border-teal-500/30 text-teal-600 dark:text-teal-400 shadow-xl">
          <span className="text-3xl font-black">404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The marketing resource, campaign page, or tool you are looking for might have been moved or does not exist.
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <Card className="shadow-lg border-slate-200 dark:border-slate-800 text-left">
          <CardContent className="p-4 sm:p-5 space-y-2.5 text-xs">
            <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px] px-1">
              Recommended Destinations
            </div>

            <Link
              href="/dashboard"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-teal-50/60 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold">
                  <LayoutDashboard className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                    Main Marketing Dashboard
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Overview, active campaigns & marketing health score
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard/content"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-teal-50/60 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    AI Content Studio
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Generate SEO Blogs, Social Posts, Ads & Emails
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard/seo"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-teal-50/60 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white font-bold">
                  <Search className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    SEO Intelligence Hub
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Keyword Research & Technical SEO Audit Scanner
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </CardContent>
        </Card>

        <div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
              <Home className="h-3.5 w-3.5" /> Back to Home Page
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-[11px] text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>ad<strong className="text-teal-600 dark:text-teal-400">AIPROMORA</strong> AI Platform</span>
        <span>Architected & Developed by <strong>Satkuri Kailash</strong></span>
      </div>
    </div>
  );
}

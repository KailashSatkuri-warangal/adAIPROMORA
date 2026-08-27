import * as React from "react";
import Link from "next/link";
import { Sparkles, Users, Target, ShieldCheck, Heart, ArrowRight, Code2, Cpu, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-3">
        <Badge variant="secondary" className="text-xs">Architect & Vision</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          About adAIPROMORA & Development
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          adAIPROMORA was architected and developed by <strong>Satkuri Kailash</strong> to provide Indian startups, small businesses, agencies, and global marketing teams with a world-class, all-in-one AI digital marketing operating system.
        </p>
      </div>

      {/* Developer Profile Card */}
      <Card className="p-8 shadow-md border-teal-200 dark:border-teal-900/60 bg-gradient-to-br from-teal-50/40 via-white to-slate-50 dark:from-teal-950/20 dark:via-slate-900 dark:to-slate-950">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white font-bold text-2xl flex items-center justify-center shadow-lg shrink-0">
            SK
          </div>
          <div className="space-y-2 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Satkuri Kailash</h2>
              <Badge variant="success" className="text-[10px]">Lead Software Architect & AI Engineer</Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Engineered the full-stack architecture of adAIPROMORA, including the multi-provider AI abstraction engine, real-time 0–100 SEO content grader, database telemetry models, event-driven automation rules, and full-funnel attribution analytics.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-[11px] text-slate-500">
              <span>📍 Hyderabad / Bengaluru, India</span>
              <span>•</span>
              <span>⚡ Full-Stack & Generative AI Systems</span>
              <span>•</span>
              <span>🚀 adAIPROMORA Engine</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3 shadow-sm border-slate-200 dark:border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center">
            <Globe className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Engineered in India for the World</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Built from the ground up to support Indian growth teams with INR currency, local SEO semantics, and multi-channel international ad platforms.
          </p>
        </Card>

        <Card className="p-6 space-y-3 shadow-sm border-slate-200 dark:border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Persistent Brand Memory</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Eliminates generic AI responses by injecting your unique Brand Kit, tone, target persona, and clinical USPs directly into every generation.
          </p>
        </Card>

        <Card className="p-6 space-y-3 shadow-sm border-slate-200 dark:border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Provider-Agnostic AI Layer</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pluggable architecture allowing seamless transitions between OpenAI, Gemini, Claude, and built-in Domain Intelligence fallback.
          </p>
        </Card>
      </div>

      <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Ready to scale your digital presence?</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Start your 14-day free trial on adAIPROMORA today or explore our live demo workspace.
        </p>
        <div className="pt-2">
          <Link href="/register">
            <Button variant="gradient" className="text-xs font-bold gap-2">
              <span>Start Free Trial</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

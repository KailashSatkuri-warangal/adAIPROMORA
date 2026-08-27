import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Share2,
  Flame,
  Mail,
  Zap,
  Globe,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ToolsShowcasePage() {
  const tools = [
    {
      title: "AI Blog Post Generator",
      desc: "Produce comprehensive SEO articles with formatted markdown, meta titles, descriptions, and FAQs.",
      href: "/dashboard/content?tab=blog",
      icon: FileText,
      tag: "Content",
    },
    {
      title: "Social Post Generator",
      desc: "Generate cross-platform copy bundles for Instagram, LinkedIn, X, Threads, and YouTube Community.",
      href: "/dashboard/content?tab=social",
      icon: Share2,
      tag: "Social",
    },
    {
      title: "Content SEO Optimizer (0-100)",
      desc: "Analyze keyword density, readability, and rewrite content in 1-click to score 95+.",
      href: "/dashboard/seo/optimizer",
      icon: Zap,
      tag: "SEO",
    },
    {
      title: "Ad Copy Generator",
      desc: "Create responsive Google Search headlines & descriptions and Meta Ad primary text hooks.",
      href: "/dashboard/content?tab=ads",
      icon: Flame,
      tag: "Paid Ads",
    },
    {
      title: "Email Sequence Builder",
      desc: "Generate subject line A/B variations, pre-headers, formatted body copy, and follow-up drips.",
      href: "/dashboard/content?tab=email",
      icon: Mail,
      tag: "Email",
    },
    {
      title: "30-Day Content Calendar",
      desc: "AI auto-generates a month-long posting schedule aligned with your active brand persona.",
      href: "/dashboard/calendar",
      icon: Calendar,
      tag: "Operations",
    },
    {
      title: "Competitor Intelligence",
      desc: "Audit competitor strengths, vulnerabilities, and SEO keyword gaps with AI battlecards.",
      href: "/dashboard/competitors",
      icon: Globe,
      tag: "Intelligence",
    },
    {
      title: "Landing Page Analyzer",
      desc: "Diagnose conversion friction points and generate high-converting wireframe blueprints.",
      href: "/dashboard/landing-page",
      icon: Sparkles,
      tag: "Conversion",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="secondary" className="text-xs">adAIPROMORA AI Toolkit • Developed by Satkuri Kailash</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Explore Our Suite of AI Marketing Tools
        </h1>
        <p className="text-sm text-slate-500">
          Every tool is pre-integrated with your Brand Kit for consistent tone, clinical accuracy, and high conversion.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <Card key={idx} className="p-5 shadow-sm border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-teal-500 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{tool.tag}</Badge>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{tool.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{tool.desc}</p>
              </div>
              <Link href={tool.href} className="pt-4">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold gap-1">
                  Launch Tool <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

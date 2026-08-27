import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  FileText,
  Search,
  Calendar,
  BarChart3,
  Share2,
  Flame,
  Globe,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FeaturesPage() {
  const featureList = [
    {
      title: "Agentic AI Marketing Assistant",
      desc: "Multi-agent conversational orchestrator connected to your Brand Kit, campaigns, and ranking telemetry. Generates 360-degree growth plans, ad hooks, and lifecycle email workflows.",
      highlights: ["Streaming markdown chat", "Contextual brand injection", "Export to PDF & Markdown"],
    },
    {
      title: "AI Content Studio & SEO Optimizer",
      desc: "Produce long-form SEO blog pillars, social carousels, ad copy, and product descriptions with live 0-100 SEO scoring and 1-click AI optimization.",
      highlights: ["Live 0-100 SEO Grader", "Keyword density check", "Multi-variation comparison"],
    },
    {
      title: "Competitor Intelligence & Battlecards",
      desc: "Audit public SEO footprints, identify competitor keyword gaps, and generate actionable SWOT battlecards to outperform category leaders.",
      highlights: ["SWOT Matrix analysis", "Uncontested keyword extraction", "Ad counter-strategies"],
    },
    {
      title: "30-Day Visual Content Calendar",
      desc: "Visual editorial calendar with Month, Week, and List queue views. Includes 1-click 30-day AI calendar auto-scheduler.",
      highlights: ["Multi-platform color badges", "Approval statuses workflow", "30-Day auto generator"],
    },
    {
      title: "Lifecycle Email Marketing Hub",
      desc: "Manage audience lists, create segmentation tags, and generate high-deliverability welcome, abandoned cart, and newsletter drips.",
      highlights: ["Subject line A/B tester", "Spam score tips", "Follow-up sequences"],
    },
    {
      title: "Attribution Analytics & AI Reports (₹ INR)",
      desc: "Track visitors, lead conversions, paid ad spend efficiency, and channel ROI with executive summaries exportable as PDF and JSON.",
      highlights: ["Full-funnel dropoff analysis", "Channel ROI breakdown", "Export to PDF & JSON"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <Badge variant="secondary" className="text-xs">Platform Architecture • Developed by Satkuri Kailash</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Built for Modern Growth Teams by adAIPROMORA
        </h1>
        <p className="text-sm text-slate-500">
          Discover all the tools and capabilities packed inside adAIPROMORA to replace fragmented subscriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureList.map((f, idx) => (
          <Card key={idx} className="p-6 space-y-4 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{f.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                {f.highlights.map((h, hidx) => (
                  <div key={hidx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/register" className="pt-2">
              <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                Explore in Studio →
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

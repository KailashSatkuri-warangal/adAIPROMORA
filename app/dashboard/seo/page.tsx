import * as React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Search,
  Zap,
  TrendingUp,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  ExternalLink,
  Sparkles,
  BarChart2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SeoClientWorkspace } from "@/components/seo/seo-client-workspace";

export default async function SeoPage() {
  const user = await getCurrentUser();
  const workspaceId = user?.workspaceId;

  const [keywords, latestAudit] = await Promise.all([
    db.keyword.findMany({
      where: { workspaceId },
      orderBy: { estimatedVolume: "desc" },
    }),
    db.sEOAudit.findFirst({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-1 border border-teal-200 dark:border-teal-800">
            <Search className="h-3 w-3" />
            <span>SEO Intelligence Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Search Engine Optimization & Keyword Authority
          </h1>
          <p className="text-xs text-slate-500">
            Run automated site technical audits, discover high-intent keyword clusters, and identify search opportunities.
          </p>
        </div>

        <Link href="/dashboard/seo/optimizer">
          <Button variant="gradient" size="sm" className="text-xs font-bold gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            <span>Open Content SEO Optimizer (0-100)</span>
          </Button>
        </Link>
      </div>

      {/* Interactive SEO Client Workspace (Audits + Keyword Explorer) */}
      <SeoClientWorkspace initialKeywords={keywords} initialAudit={latestAudit} />
    </div>
  );
}

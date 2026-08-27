"use client";

import * as React from "react";
import {
  Layout,
  Sparkles,
  Globe,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sliders,
  Layers,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function LandingPageAuditPage() {
  const [url, setUrl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [auditData, setAuditData] = React.useState<any>(null);

  const handleAudit = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/landing-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (json.data) {
        setAuditData(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-1 border border-teal-200 dark:border-teal-800">
            <Layout className="h-3 w-3" />
            <span>Conversion Optimization</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            AI Landing Page & Funnel Structure Analyzer
          </h1>
          <p className="text-xs text-slate-500">
            Audit public landing page structure, diagnose conversion leaks, and generate high-converting wireframe blueprints.
          </p>
        </div>
      </div>

      {/* URL Input Bar */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter landing page URL to audit (e.g. https://yourbrand.com/products/serum)..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 shadow-xs"
              />
            </div>
            <Button
              onClick={handleAudit}
              disabled={isLoading || !url.trim()}
              className="h-11 px-6 text-xs font-bold gap-2 w-full sm:w-auto"
            >
              <Sparkles className="h-4 w-4" />
              {isLoading ? "Auditing Conversion Architecture..." : "Analyze Landing Page"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {!auditData ? (
        <div className="h-80 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
          <Layout className="h-10 w-10 text-slate-300 dark:text-slate-700" />
          <div className="space-y-1">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Landing Page Audit Run Yet</div>
            <p className="text-xs text-slate-500 max-w-sm">Enter any landing page URL above and click "Analyze Landing Page" to diagnose friction points.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in">
          {/* Score Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="shadow-sm bg-gradient-to-br from-teal-900 to-slate-900 text-white">
              <CardContent className="p-5 text-center space-y-1">
                <div className="text-3xl font-black text-teal-400">{auditData.conversionScore || 86}/100</div>
                <div className="text-xs font-bold">Conversion Score</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-5 text-center space-y-1">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{auditData.seoScore || 91}/100</div>
                <div className="text-xs font-medium text-slate-500">SEO Alignment</div>
                <Progress value={auditData.seoScore || 91} className="h-1 mt-1" />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-5 text-center space-y-1">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{auditData.copyScore || 85}/100</div>
                <div className="text-xs font-medium text-slate-500">Copy & Value Hook</div>
                <Progress value={auditData.copyScore || 85} className="h-1 mt-1" />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-5 text-center space-y-1">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{auditData.ctaScore || 80}/100</div>
                <div className="text-xs font-medium text-slate-500">CTA Friction</div>
                <Progress value={auditData.ctaScore || 80} className="h-1 mt-1" />
              </CardContent>
            </Card>
          </div>

          {/* Recommendations & Improved Structure Blueprint */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recommendations Column */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-600" />
                    UX & Conversion Levers
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2.5 text-xs">
                  {auditData.frictionPoints?.map((rec: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="font-bold text-teal-600">#{idx + 1}</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    A/B Test Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2.5 text-xs">
                  {auditData.abTestSuggestions?.map((rec: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-slate-700 dark:text-slate-300">
                      {rec}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Improved Structure Wireframe Blueprint */}
            <Card className="lg:col-span-7 shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-sm font-bold">
                  AI Optimized Page Flow Architecture
                </CardTitle>
                <CardDescription className="text-xs">
                  Sequential high-converting landing page layout blueprint
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {auditData.wireframeSections?.map((sec: any, idx: number) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-full p-4 rounded-xl border border-teal-200/80 bg-teal-50/50 dark:border-teal-900/60 dark:bg-teal-950/20 space-y-1">
                      <div className="font-bold text-xs text-teal-900 dark:text-teal-200">
                        {sec.title}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        {sec.content}
                      </div>
                    </div>
                    {idx < auditData.wireframeSections.length - 1 && (
                      <ArrowDown className="h-4 w-4 text-teal-500 my-1 opacity-70" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

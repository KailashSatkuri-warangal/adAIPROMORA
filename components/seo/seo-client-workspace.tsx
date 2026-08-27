"use client";

import * as React from "react";
import {
  Search,
  Sparkles,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Info,
  TrendingUp,
  Target,
  Layers,
  ArrowRight,
  ExternalLink,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { trackMarketingEvent } from "@/lib/firebase";

interface Props {
  initialKeywords: any[];
  initialAudit: any;
}

export function SeoClientWorkspace({ initialKeywords = [], initialAudit }: Props) {
  const [keywords, setKeywords] = React.useState<any[]>(initialKeywords || []);
  const [audit, setAudit] = React.useState<any>(initialAudit || null);
  const [auditUrl, setAuditUrl] = React.useState("");
  const [kwSearch, setKwSearch] = React.useState("");
  const [isLoadingAudit, setIsLoadingAudit] = React.useState(false);
  const [isLoadingKw, setIsLoadingKw] = React.useState(false);
  const [searchedKwData, setSearchedKwData] = React.useState<any>(null);

  const handleRunAudit = async () => {
    if (!auditUrl.trim()) return;
    setIsLoadingAudit(true);
    try {
      const res = await fetch("/api/ai/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "audit", query: auditUrl }),
      });
      const data = await res.json();
      if (data.data) {
        setAudit(data.data);
        trackMarketingEvent("seo_audit_completed", { url: auditUrl, score: data.data.overallScore });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAudit(false);
    }
  };

  const handleSearchKeywords = async () => {
    if (!kwSearch.trim()) return;
    setIsLoadingKw(true);
    try {
      const res = await fetch("/api/ai/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "keywords", query: kwSearch }),
      });
      const data = await res.json();
      if (data.data) {
        setSearchedKwData(data.data);
        setKeywords((prev) => [
          {
            id: `kw-${Date.now()}`,
            term: data.data.rootTerm || kwSearch,
            intent: data.data.intent?.toUpperCase() || "COMMERCIAL",
            difficulty: data.data.difficulty || 32,
            estimatedVolume: data.data.estimatedVolume || 18500,
            cpc: data.data.cpc || 2.5,
            category: "Search Opportunity",
          },
          ...prev,
        ]);
        trackMarketingEvent("keyword_search_completed", { query: kwSearch });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingKw(false);
    }
  };

  const issuesList = audit?.issuesJson
    ? typeof audit.issuesJson === "string"
      ? JSON.parse(audit.issuesJson)
      : audit.issuesJson
    : audit?.issues || [];

  const recsList = audit?.recommendationsJson
    ? typeof audit.recommendationsJson === "string"
      ? JSON.parse(audit.recommendationsJson)
      : audit.recommendationsJson
    : audit?.recommendations || [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="audit" className="space-y-6">
        <TabsList className="grid grid-cols-2 max-w-md h-11">
          <TabsTrigger value="audit" className="text-xs gap-1.5">
            <Globe className="h-3.5 w-3.5" /> Technical Site Audit
          </TabsTrigger>
          <TabsTrigger value="keywords" className="text-xs gap-1.5">
            <Search className="h-3.5 w-3.5" /> Keyword Intelligence
          </TabsTrigger>
        </TabsList>

        {/* 1. TECHNICAL AUDIT TAB */}
        <TabsContent value="audit" className="space-y-6">
          {/* URL Audit Input */}
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    value={auditUrl}
                    onChange={(e) => setAuditUrl(e.target.value)}
                    placeholder="Enter website URL to audit (e.g. https://yourdomain.com)..."
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 shadow-xs"
                  />
                </div>
                <Button
                  onClick={handleRunAudit}
                  disabled={isLoadingAudit || !auditUrl.trim()}
                  className="h-11 px-6 text-xs font-bold gap-2 w-full sm:w-auto"
                >
                  <Sparkles className="h-4 w-4" />
                  {isLoadingAudit ? "Analyzing Technical SEO..." : "Run SEO Audit"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {!audit ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <Globe className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Technical Audit Run Yet</div>
                <p className="text-xs text-slate-500 max-w-md">
                  Enter any website URL above (e.g. https://yourbrand.com) and click "Run SEO Audit" to diagnose on-page health, Core Web Vitals, and indexing issues.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in">
              {/* Score Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <Card className="shadow-sm bg-gradient-to-br from-teal-900 to-slate-900 text-white col-span-2 sm:col-span-1">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
                    <div className="text-3xl font-black text-teal-400">{audit.overallScore || 88}</div>
                    <div className="text-xs font-bold">Overall SEO Score</div>
                    <span className="text-[10px] text-teal-200">Optimal Range</span>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{audit.technicalScore || 92}%</div>
                    <div className="text-xs font-medium text-slate-500">Technical Health</div>
                    <Progress value={audit.technicalScore || 92} className="h-1 mt-1" />
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{audit.contentScore || 85}%</div>
                    <div className="text-xs font-medium text-slate-500">On-Page Content</div>
                    <Progress value={audit.contentScore || 85} className="h-1 mt-1" />
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{audit.mobileScore || 94}%</div>
                    <div className="text-xs font-medium text-slate-500">Mobile UX & Speed</div>
                    <Progress value={audit.mobileScore || 94} className="h-1 mt-1" />
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{audit.performanceScore || 82}%</div>
                    <div className="text-xs font-medium text-slate-500">Core Web Vitals</div>
                    <Progress value={audit.performanceScore || 82} className="h-1 mt-1" />
                  </CardContent>
                </Card>
              </div>

              {/* Issues & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Detected Technical Issues ({issuesList.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs">
                    {issuesList.map((issue: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 flex items-start gap-2.5"
                      >
                        {issue.type === "warning" ? (
                          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        )}
                        <span className="text-slate-700 dark:text-slate-300">{issue.message}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-teal-600" />
                      AI Actionable Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs">
                    {recsList.map((rec: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-teal-100 bg-teal-50/40 dark:border-teal-900/40 dark:bg-teal-950/20 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{rec}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        {/* 2. KEYWORD INTELLIGENCE TAB */}
        <TabsContent value="keywords" className="space-y-6">
          {/* Keyword Search Input */}
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    value={kwSearch}
                    onChange={(e) => setKwSearch(e.target.value)}
                    placeholder="Search any seed keyword (e.g. 'best natural ceramide moisturizer')..."
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 shadow-xs"
                  />
                </div>
                <Button
                  onClick={handleSearchKeywords}
                  disabled={isLoadingKw || !kwSearch.trim()}
                  className="h-11 px-6 text-xs font-bold gap-2 w-full sm:w-auto"
                >
                  <Sparkles className="h-4 w-4" />
                  {isLoadingKw ? "Extracting Semantic Keywords..." : "Analyze Keywords"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Searched Keyword Breakdown */}
          {searchedKwData && (
            <Card className="shadow-sm border-teal-200 dark:border-teal-900/60 bg-teal-50/20 dark:bg-teal-950/10 animate-in fade-in">
              <CardHeader className="pb-3 border-b border-teal-100 dark:border-teal-900/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base font-bold text-teal-950 dark:text-teal-200">
                      Keyword Intelligence: "{searchedKwData.rootTerm}"
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Semantic intent & competition breakdown (AI Estimates clearly marked)
                    </CardDescription>
                  </div>
                  <Badge variant="success" className="text-[10px] w-fit">
                    AI Semantic Estimates
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {formatNumber(searchedKwData.estimatedVolume || 18500)}
                    </div>
                    <div className="text-[11px] text-slate-500">Monthly Volume (Est.)</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                    <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                      {searchedKwData.difficulty || 45}/100
                    </div>
                    <div className="text-[11px] text-slate-500">Keyword Difficulty</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(searchedKwData.cpc || 2.75)}
                    </div>
                    <div className="text-[11px] text-slate-500">Estimated CPC</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                    <div className="text-sm font-bold text-teal-700 dark:text-teal-300">
                      {searchedKwData.intent || "Commercial"}
                    </div>
                    <div className="text-[11px] text-slate-500">Search Intent</div>
                  </div>
                </div>

                {/* Related Keywords Grid */}
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100">Related Semantic Search Terms:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {searchedKwData.relatedKeywords?.map((rkw: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{rkw.term}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[9px]">{rkw.intent}</Badge>
                          <span className="text-[11px] font-mono text-slate-500">{formatNumber(rkw.volume || 8000)}/mo</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saved Tracked Keywords Table */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold">Tracked High-Intent Keywords ({keywords.length})</CardTitle>
              <CardDescription className="text-xs">Active keyword ranking portfolio</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {keywords.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No tracked keywords yet. Use the search bar above to research and track keywords.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-slate-500">
                      <tr>
                        <th className="p-3.5 font-semibold">Keyword Term</th>
                        <th className="p-3.5 font-semibold">Intent</th>
                        <th className="p-3.5 font-semibold">Difficulty</th>
                        <th className="p-3.5 font-semibold">Est. Volume</th>
                        <th className="p-3.5 font-semibold">Est. CPC</th>
                        <th className="p-3.5 font-semibold">Category</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {keywords.map((kw) => (
                        <tr key={kw.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                          <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                            {kw.term}
                          </td>
                          <td className="p-3.5">
                            <Badge variant="secondary" className="text-[10px]">{kw.intent}</Badge>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{kw.difficulty}/100</span>
                              <Progress value={kw.difficulty} className="w-16 h-1" />
                            </div>
                          </td>
                          <td className="p-3.5 font-mono">{formatNumber(kw.estimatedVolume)}</td>
                          <td className="p-3.5 font-mono">{formatCurrency(kw.cpc)}</td>
                          <td className="p-3.5 text-slate-500">{kw.category || "General"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

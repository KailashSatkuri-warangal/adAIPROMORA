"use client";

import * as React from "react";
import {
  Globe,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sword,
  Target,
  Share2,
  Search,
  Plus,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = React.useState<any[]>([]);
  const [domainInput, setDomainInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedComp, setSelectedComp] = React.useState<any>(null);

  const fetchCompetitors = async () => {
    try {
      const res = await fetch("/api/competitors");
      const json = await res.json();
      if (json.competitors) {
        setCompetitors(json.competitors);
        if (json.competitors.length > 0 && !selectedComp) {
          setSelectedComp(json.competitors[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchCompetitors();
  }, []);

  const handleAnalyzeCompetitor = async () => {
    if (!domainInput.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/competitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainInput }),
      });
      const json = await res.json();
      if (json.competitor) {
        setCompetitors((prev) => [json.competitor, ...prev]);
        setSelectedComp(json.competitor);
        setDomainInput("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const parseJsonSafe = (val: any) => {
    if (!val) return [];
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch (e) {
        return [];
      }
    }
    return val;
  };

  const selectedBattlecard = parseJsonSafe(selectedComp?.battlecardJson);
  const selectedStrengths = parseJsonSafe(selectedComp?.strengthsJson);
  const selectedWeaknesses = parseJsonSafe(selectedComp?.weaknessesJson);
  const selectedSeoOpps = parseJsonSafe(selectedComp?.seoOpportunitiesJson);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-1 border border-teal-200 dark:border-teal-800">
            <Globe className="h-3 w-3" />
            <span>Competitive Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Competitor Positioning & Outperform Playbooks
          </h1>
          <p className="text-xs text-slate-500">
            Analyze competitor strengths, vulnerabilities, and SEO keyword gaps with AI-generated battlecards.
          </p>
        </div>
      </div>

      {/* Add Competitor Bar */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="Enter competitor domain (e.g. luxeflorabotanicals.com or competitor.com)..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 shadow-xs"
                />
            </div>
            <Button
              onClick={handleAnalyzeCompetitor}
              disabled={isLoading || !domainInput}
              className="h-11 px-6 text-xs font-bold gap-2 w-full sm:w-auto"
            >
              <Sparkles className="h-4 w-4" />
              {isLoading ? "Auditing Competitor..." : "Audit Competitor"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout: Competitor Selector & Detailed Battlecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tracked Competitors List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            Tracked Competitors ({competitors.length})
          </div>
          {competitors.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setSelectedComp(comp)}
              className={`w-full text-left p-4 rounded-xl border transition-all space-y-1.5 ${
                selectedComp?.id === comp.id
                  ? "border-teal-500 bg-teal-50/40 dark:bg-teal-950/30 shadow-sm"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {comp.name}
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {comp.domain}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{comp.summary}</p>
            </button>
          ))}
        </div>

        {/* Right Column: In-Depth Battlecard & SWOT Matrix */}
        <div className="lg:col-span-8 space-y-6">
          {selectedComp ? (
            <div className="space-y-6 animate-in fade-in">
              {/* Battlecard Hero Card */}
              <Card className="shadow-sm border-teal-200 dark:border-teal-900 bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white">
                <CardHeader className="pb-3 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-slate-950 font-bold">
                        <Sword className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-white">
                          AI Outperform Battlecard: {selectedComp.name}
                        </CardTitle>
                        <CardDescription className="text-teal-300 text-xs">
                          Actionable positioning angles to win their market share
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                    <div className="font-bold text-teal-300 uppercase tracking-wider text-[11px]">
                      Our Core Winning Differentiator:
                    </div>
                    <p className="text-sm font-medium text-white leading-relaxed">
                      {selectedBattlecard?.keyDifferentiator || "Clinical validation & 100% cold-pressed clean formulation."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
                      <div className="font-semibold text-teal-200 text-[11px]">Paid Ads Counter-Hook:</div>
                      <p className="text-slate-300">
                        {selectedBattlecard?.adStrategy || "Run comparative proof ads highlighting 'Beauty without the stinging perfumes'."}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
                      <div className="font-semibold text-teal-200 text-[11px]">Pitch to Frustrated Users:</div>
                      <p className="text-slate-300">
                        {selectedBattlecard?.pitchToFrustratedUsers || "Switch to non-comedogenic botanical barrier care with 14-day clinical guarantee."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SWOT Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" /> Competitor Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2 text-xs">
                    {selectedStrengths.map((str: string, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                        • {str}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4" /> Competitor Vulnerabilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2 text-xs">
                    {selectedWeaknesses.map((weak: string, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-red-50/40 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-slate-700 dark:text-slate-300">
                        • {weak}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* SEO Gaps to Exploit */}
              <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Search className="h-4 w-4 text-teal-600" /> SEO Opportunities & Uncontested Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2 text-xs">
                  {selectedSeoOpps.map((opp: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-teal-50/40 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 flex items-center justify-between">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{opp}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => (window.location.href = `/dashboard/content?tab=blog&topic=${encodeURIComponent(opp)}`)}
                        className="h-7 text-[11px] gap-1"
                      >
                        Create Pillar Blog <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center text-slate-400">
              <Globe className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-xs">Select a competitor or audit a new domain to view the battlecard.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import {
  Target,
  Sparkles,
  Plus,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Flame,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = React.useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [campaignName, setCampaignName] = React.useState("");
  const [campaignGoal, setCampaignGoal] = React.useState("");
  const [budget, setBudget] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedStrategy, setGeneratedStrategy] = React.useState<any>(null);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns");
      const json = await res.json();
      if (json.campaigns) setCampaigns(json.campaigns);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleGenerateBlueprint = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goals: [campaignGoal],
          budgetMonthly: budget,
          targetChannels: ["Meta Ads", "SEO", "Email Drips", "Social Virality"],
        }),
      });
      const json = await res.json();
      if (json.strategy) {
        setGeneratedStrategy(json.strategy);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCampaign = async () => {
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: campaignName || generatedStrategy?.strategyTitle || "New AI Campaign",
          objective: campaignGoal,
          budget: Number(budget),
          channels: ["META_ADS", "GOOGLE_ADS", "SEO", "EMAIL"],
          strategyOverview: generatedStrategy?.positioning,
        }),
      });
      const json = await res.json();
      if (json.campaign) {
        setCampaigns((prev) => [json.campaign, ...prev]);
        setIsModalOpen(false);
        setGeneratedStrategy(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-1 border border-teal-200 dark:border-teal-800">
            <Target className="h-3 w-3" />
            <span>Campaign Orchestration</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Multi-Channel Marketing Campaigns
          </h1>
          <p className="text-xs text-slate-500">
            Manage budgets, strategy messaging pillars, and track cross-channel acquisition ROAS.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="gradient"
          size="sm"
          className="h-10 px-4 text-xs font-bold gap-2 shadow-md"
        >
          <Sparkles className="h-4 w-4" />
          <span>New AI Campaign Blueprint</span>
        </Button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map((camp) => {
          const channels: string[] = camp.channelsJson ? JSON.parse(camp.channelsJson) : [];
          const metrics = camp.metricsJson ? JSON.parse(camp.metricsJson) : null;
          const budgetPercent = camp.budget > 0 ? Math.min(100, Math.round((camp.spent / camp.budget) * 100)) : 0;

          return (
            <Card key={camp.id} className="shadow-sm border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-all flex flex-col justify-between">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-bold">{camp.name}</CardTitle>
                    <CardDescription className="text-xs">{camp.objective}</CardDescription>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    {camp.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4 text-xs">
                {camp.strategyOverview && (
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {camp.strategyOverview}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {channels.map((ch) => (
                    <span
                      key={ch}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {ch.replace("_", " ")}
                    </span>
                  ))}
                </div>

                {/* Budget Progress */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Spent: {formatCurrency(camp.spent)}</span>
                    <span>Budget: {formatCurrency(camp.budget)} ({budgetPercent}%)</span>
                  </div>
                  <Progress value={budgetPercent} className="h-2" />
                </div>

                {/* Metrics Breakdown if available */}
                {metrics && (
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{formatNumber(metrics.clicks)}</div>
                      <div className="text-[10px] text-slate-500">Clicks</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{formatNumber(metrics.conversions)}</div>
                      <div className="text-[10px] text-slate-500">Purchases</div>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">{metrics.roas}x</div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-300">ROAS</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Campaign & Generate AI Strategy Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-600" />
              AI Campaign Blueprint Generator
            </DialogTitle>
            <DialogDescription className="text-xs">
              Generate a 360-degree omnichannel growth blueprint complete with messaging pillars and 30-day milestones.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Campaign Name</label>
                <input
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Summer Radiance Acquisition Sprint"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Monthly Budget ($)</label>
                <input
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="8500"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Primary Objective</label>
              <input
                value={campaignGoal}
                onChange={(e) => setCampaignGoal(e.target.value)}
                placeholder="e.g. Customer Acquisition & 4.0+ ROAS"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
              />
            </div>

            {!generatedStrategy ? (
              <Button
                onClick={handleGenerateBlueprint}
                disabled={isGenerating}
                className="w-full h-11 text-xs font-bold gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? "Synthesizing AI Campaign Blueprint..." : "Generate AI Campaign Blueprint"}
              </Button>
            ) : (
              <div className="space-y-4 animate-in fade-in pt-2">
                <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2">
                  <div className="font-bold text-sm text-teal-950 dark:text-teal-200">
                    {generatedStrategy.strategyTitle}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    {generatedStrategy.positioning}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="font-semibold text-slate-700 dark:text-slate-300">Target Channel Allocation:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {generatedStrategy.channelBreakdown?.map((ch: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex justify-between">
                          <span>{ch.channel}</span>
                          <span className="text-teal-600 font-mono">{ch.allocation}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{ch.tactics}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSaveCampaign}
                  className="w-full h-11 text-xs font-bold gap-2 bg-teal-700 hover:bg-teal-800"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Save & Launch Campaign
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

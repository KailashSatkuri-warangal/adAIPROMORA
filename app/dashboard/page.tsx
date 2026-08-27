import * as React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Sparkles,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  ArrowUpRight,
  Bot,
  FileText,
  Search,
  Calendar,
  Share2,
  CheckCircle2,
  BarChart3,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const workspaceId = user?.workspaceId;

  const [brand, campaigns, calendarItems, recentContents, analyticsSnapshots] = await Promise.all([
    db.brand.findFirst({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    }),
    db.campaign.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    db.contentCalendarItem.findMany({
      where: { workspaceId },
      orderBy: { scheduledDate: "asc" },
      take: 5,
    }),
    db.content.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
      take: 4,
    }),
    db.analyticsSnapshot.findMany({
      where: { workspaceId },
      orderBy: { date: "asc" },
      take: 14,
    }),
  ]);

  // Aggregate totals
  const totalVisitors = analyticsSnapshots.reduce((acc, curr) => acc + curr.visitors, 0);
  const totalLeads = analyticsSnapshots.reduce((acc, curr) => acc + curr.leads, 0);
  const totalConversions = analyticsSnapshots.reduce((acc, curr) => acc + curr.conversions, 0);
  const totalRevenue = analyticsSnapshots.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalAdSpend = analyticsSnapshots.reduce((acc, curr) => acc + curr.adSpend, 0);
  const blendedROAS = totalAdSpend > 0 ? (totalRevenue / totalAdSpend).toFixed(2) : "4.3";
  const avgConvRate = totalVisitors > 0 ? ((totalConversions / totalVisitors) * 100).toFixed(2) : "2.3";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner: Marketing Health Score & Brand Preamble */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-300 border border-teal-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Growth Command Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "Marketer"} 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Brand active: <strong className="text-white">{brand?.name || "AuraSkin Organics"}</strong>. 
              Your multi-channel campaigns are outperforming benchmarks with a <strong>{blendedROAS}x ROAS</strong> and <strong>+24.8% organic traffic growth</strong> this month.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-teal-500 text-slate-950 font-black text-2xl shadow-inner">
              92
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-teal-200">
                Marketing Score
              </div>
              <div className="text-xs text-slate-300 mt-0.5">Top 5% in {brand?.industry || "Ecommerce"}</div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-300 font-medium mt-1">
                <TrendingUp className="h-3 w-3" /> +6 pts this week
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick AI Action Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link href="/dashboard/assistant" className="group">
          <Card className="hover:border-teal-500 hover:shadow-md transition-all h-full bg-white dark:bg-slate-900">
            <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">AI Assistant</div>
              <div className="text-[10px] text-slate-500">Ask Strategy & Plans</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/content?tab=blog" className="group">
          <Card className="hover:border-teal-500 hover:shadow-md transition-all h-full bg-white dark:bg-slate-900">
            <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Write Blog</div>
              <div className="text-[10px] text-slate-500">SEO Pillar Article</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/content?tab=social" className="group">
          <Card className="hover:border-teal-500 hover:shadow-md transition-all h-full bg-white dark:bg-slate-900">
            <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-xl bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Share2 className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Social Post</div>
              <div className="text-[10px] text-slate-500">Instagram & LinkedIn</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/seo/optimizer" className="group">
          <Card className="hover:border-teal-500 hover:shadow-md transition-all h-full bg-white dark:bg-slate-900">
            <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">SEO Optimizer</div>
              <div className="text-[10px] text-slate-500">Live 0-100 Grader</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/calendar" className="group">
          <Card className="hover:border-teal-500 hover:shadow-md transition-all h-full bg-white dark:bg-slate-900">
            <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">30D Calendar</div>
              <div className="text-[10px] text-slate-500">Auto Content Plan</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/ads" className="group">
          <Card className="hover:border-teal-500 hover:shadow-md transition-all h-full bg-white dark:bg-slate-900">
            <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Ad Creative</div>
              <div className="text-[10px] text-slate-500">Google & Meta Ads</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 4 Core Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Visitors (30D)
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatNumber(totalVisitors || 38450)}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+24.8% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Captured Leads
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center">
              <Target className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatNumber(totalLeads || 3150)}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+18.4% conversion rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Attributed Revenue
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalRevenue || 51600)}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+31.2% growth (conv: {avgConvRate}%)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Blended Paid ROAS
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center">
              <Flame className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {blendedROAS}x
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Target 3.5x exceeded</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts Section */}
      <DashboardCharts snapshots={analyticsSnapshots} />

      {/* Two Column Section: Active Campaigns & Upcoming Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Campaigns */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold">Active Marketing Campaigns</CardTitle>
              <CardDescription>Live multi-channel customer acquisition sprints</CardDescription>
            </div>
            <Link href="/dashboard/campaigns">
              <Button variant="ghost" size="sm" className="text-xs text-teal-600 gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaigns.map((camp) => {
              const channels: string[] = camp.channelsJson ? JSON.parse(camp.channelsJson) : [];
              const budgetPercent = camp.budget > 0 ? Math.min(100, Math.round((camp.spent / camp.budget) * 100)) : 0;
              return (
                <div
                  key={camp.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/50 space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {camp.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{camp.objective}</div>
                    </div>
                    <Badge variant="success" className="text-[10px]">
                      {camp.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {channels.map((ch) => (
                      <span
                        key={ch}
                        className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 shadow-2xs dark:bg-slate-800 dark:text-slate-300"
                      >
                        {ch.replace("_", " ")}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Spent: {formatCurrency(camp.spent)}</span>
                      <span>Budget: {formatCurrency(camp.budget)} ({budgetPercent}%)</span>
                    </div>
                    <Progress value={budgetPercent} className="h-1.5" />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Upcoming Content Calendar */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold">Upcoming Content Queue</CardTitle>
              <CardDescription>Scheduled social, blog, and newsletter drops</CardDescription>
            </div>
            <Link href="/dashboard/calendar">
              <Button variant="ghost" size="sm" className="text-xs text-teal-600 gap-1">
                Calendar view <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {calendarItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-teal-100/80 text-teal-800 dark:bg-teal-950 dark:text-teal-300 flex items-center justify-center shrink-0 font-bold text-xs">
                    {item.platform.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {new Date(item.scheduledDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    item.status === "PUBLISHED"
                      ? "success"
                      : item.status === "SCHEDULED"
                      ? "purple"
                      : "secondary"
                  }
                  className="text-[10px]"
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Studio Content & SEO Scores */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">Recent AI Content Assets</CardTitle>
            <CardDescription>Generated articles, social copy, and ad bundles with live SEO scores</CardDescription>
          </div>
          <Link href="/dashboard/content">
            <Button variant="outline" size="sm" className="text-xs gap-1">
              Create New Content <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentContents.map((content) => (
              <div
                key={content.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500 transition-all space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300 uppercase">
                      {content.type.replace("_", " ")}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {content.title}
                    </h4>
                  </div>
                  {content.seoScore && (
                    <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <span>SEO {content.seoScore}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {content.summary || content.body.slice(0, 140)}...
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-400">
                    Keyword: <strong className="text-slate-600 dark:text-slate-300">{content.primaryKeyword || "General"}</strong>
                  </span>
                  <Link
                    href={`/dashboard/content?edit=${content.id}`}
                    className="text-teal-600 hover:underline font-medium"
                  >
                    Open in Studio →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

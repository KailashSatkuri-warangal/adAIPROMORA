import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AIProviderFactory } from "@/lib/ai/providers/provider-factory";
import { buildMarketingReportPrompt } from "@/lib/ai/prompts/reports";
import { checkWorkspaceQuota, recordAIUsage } from "@/lib/ai/usage";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quota = await checkWorkspaceQuota(user.workspaceId);
    if (!quota.allowed) {
      return NextResponse.json({ error: quota.reason }, { status: 429 });
    }

    const [brand, snapshots] = await Promise.all([
      db.brand.findFirst({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "desc" },
      }),
      db.analyticsSnapshot.findMany({
        where: { workspaceId: user.workspaceId },
        orderBy: { date: "desc" },
        take: 30,
      }),
    ]);

    const totalVisitors = snapshots.reduce((acc, curr) => acc + curr.visitors, 0);
    const totalLeads = snapshots.reduce((acc, curr) => acc + curr.leads, 0);
    const totalConversions = snapshots.reduce((acc, curr) => acc + curr.conversions, 0);
    const totalRevenue = snapshots.reduce((acc, curr) => acc + curr.revenue, 0);

    const metricsSummary = {
      totalVisitors,
      totalLeads,
      totalConversions,
      totalRevenue,
      avgConversionRate: totalVisitors > 0 ? ((totalConversions / totalVisitors) * 100).toFixed(2) + "%" : "2.3%",
    };

    const prompt = buildMarketingReportPrompt(metricsSummary, brand);

    const res = await AIProviderFactory.executeWithFallback(async (provider) => {
      return await provider.generateJSON({
        prompt,
        brandContext: brand,
        feature: "executive_report",
        workspaceId: user.workspaceId,
      });
    });

    const reportData: any = res.data;

    // Save Report to DB
    const saved = await db.report.create({
      data: {
        workspaceId: user.workspaceId,
        title: reportData.title || "Monthly Marketing Intelligence Report",
        type: "monthly_summary",
        period: "Last 30 Days",
        executiveSummary: reportData.executiveSummary || "Summary of monthly performance and growth attribution.",
        insightsJson: JSON.stringify({
          whatWorked: reportData.whatWorked || [],
          whatDidNotWork: reportData.whatDidNotWork || [],
          topChannels: reportData.topChannels || [],
        }),
        recommendationsJson: JSON.stringify(reportData.recommendedActionItems || []),
        metricsJson: JSON.stringify(metricsSummary),
      },
    });

    await recordAIUsage({
      workspaceId: user.workspaceId,
      feature: "executive_report",
      model: res.usage.model,
      promptTokens: res.usage.promptTokens,
      completionTokens: res.usage.completionTokens,
      totalTokens: res.usage.totalTokens,
    });

    return NextResponse.json({ report: saved, data: reportData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reports = await db.report.findMany({
      where: { workspaceId: user.workspaceId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reports });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

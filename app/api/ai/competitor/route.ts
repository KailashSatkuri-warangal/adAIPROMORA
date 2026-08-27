import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AIProviderFactory } from "@/lib/ai/providers/provider-factory";
import { buildCompetitorAnalysisPrompt } from "@/lib/ai/prompts/competitor";
import { checkWorkspaceQuota, recordAIUsage } from "@/lib/ai/usage";
import { syncCompetitorToFirestore } from "@/lib/firestore-db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domain } = await req.json();
    if (!domain) {
      return NextResponse.json({ error: "Competitor domain is required" }, { status: 400 });
    }

    const quota = await checkWorkspaceQuota(user.workspaceId);
    if (!quota.allowed) {
      return NextResponse.json({ error: quota.reason }, { status: 429 });
    }

    const brand = await db.brand.findFirst({
      where: { workspaceId: user.workspaceId },
      orderBy: { createdAt: "desc" },
    });

    const prompt = buildCompetitorAnalysisPrompt(domain, brand);

    const res = await AIProviderFactory.executeWithFallback(async (provider) => {
      return await provider.generateJSON({
        prompt,
        brandContext: brand,
        feature: "competitor_analysis",
        workspaceId: user.workspaceId,
      });
    });

    const compData: any = res.data;

    // Save Competitor to DB
    const saved = await db.competitor.create({
      data: {
        workspaceId: user.workspaceId,
        name: compData.name || domain,
        domain: domain,
        summary: compData.summary,
        strengthsJson: JSON.stringify(compData.strengths || []),
        weaknessesJson: JSON.stringify(compData.weaknesses || []),
        seoOpportunitiesJson: JSON.stringify(compData.seoOpportunities || []),
        socialPresenceJson: JSON.stringify(compData.socialPresence || {}),
        battlecardJson: JSON.stringify(compData.battlecard || {}),
      },
    });

    // Real-time Firestore sync
    await syncCompetitorToFirestore(user.workspaceId, saved);

    await recordAIUsage({
      workspaceId: user.workspaceId,
      feature: "competitor_analysis",
      model: res.usage.model,
      promptTokens: res.usage.promptTokens,
      completionTokens: res.usage.completionTokens,
      totalTokens: res.usage.totalTokens,
    });

    return NextResponse.json({ competitor: saved, data: compData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

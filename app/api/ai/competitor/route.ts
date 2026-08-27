import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AIProviderFactory } from "@/lib/ai/providers/provider-factory";
import { buildCompetitorAnalysisPrompt } from "@/lib/ai/prompts/competitor";
import { checkWorkspaceQuota, recordAIUsage } from "@/lib/ai/usage";
import { syncCompetitorToFirestore } from "@/lib/firestore-db";

const DEFAULT_BRAND_CONTEXT = {
  id: "brand-vedaglow-default",
  name: "VedaGlow Organics India",
  industry: "Ayurvedic Beauty & Wellness",
  uniqueSellingProp: "Pure Ayurvedic Bio-Fermented Clean Skincare with Zero Synthetic Fillers",
  voice: "Authoritative, Scientific & Inspiring",
  tone: "Empathetic & High-Converting",
};

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

    await checkWorkspaceQuota(user.workspaceId);

    let brand: any = DEFAULT_BRAND_CONTEXT;
    try {
      const dbBrand = await db.brand.findFirst({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "desc" },
      });
      if (dbBrand) brand = dbBrand;
    } catch (e) {
      // Ignore DB read error on Vercel
    }

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

    const competitorObj = {
      id: `comp-${Date.now()}`,
      workspaceId: user.workspaceId,
      name: compData.name || domain,
      domain: domain,
      summary: compData.summary || `Strategic analysis for ${domain}`,
      strengthsJson: JSON.stringify(compData.strengths || []),
      weaknessesJson: JSON.stringify(compData.weaknesses || []),
      seoOpportunitiesJson: JSON.stringify(compData.seoOpportunities || []),
      socialPresenceJson: JSON.stringify(compData.socialPresence || {}),
      battlecardJson: JSON.stringify(compData.battlecard || {}),
      createdAt: new Date().toISOString(),
    };

    try {
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
      await syncCompetitorToFirestore(user.workspaceId, saved);
    } catch (dbErr) {
      await syncCompetitorToFirestore(user.workspaceId, competitorObj);
    }

    recordAIUsage({
      workspaceId: user.workspaceId,
      feature: "competitor_analysis",
      model: res.usage.model,
      promptTokens: res.usage.promptTokens,
      completionTokens: res.usage.completionTokens,
      totalTokens: res.usage.totalTokens,
    });

    return NextResponse.json({ competitor: compData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to analyze competitor." }, { status: 500 });
  }
}

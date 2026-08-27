import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AIProviderFactory } from "@/lib/ai/providers/provider-factory";
import { buildStrategyPrompt } from "@/lib/ai/prompts/strategy";
import { checkWorkspaceQuota, recordAIUsage } from "@/lib/ai/usage";

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

    const { goals, budgetMonthly, targetChannels } = await req.json();

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

    const prompt = buildStrategyPrompt({
      goals: goals || ["Increase Sales", "Generate Leads"],
      budgetMonthly: Number(budgetMonthly) || 5000,
      targetChannels: targetChannels || ["SEO", "Meta Ads", "Email"],
      brandContext: brand,
    });

    const res = await AIProviderFactory.executeWithFallback(async (provider) => {
      return await provider.generateJSON({
        prompt,
        brandContext: brand,
        feature: "strategy_generator",
        workspaceId: user.workspaceId,
      });
    });

    recordAIUsage({
      workspaceId: user.workspaceId,
      feature: "strategy_generator",
      model: res.usage.model,
      promptTokens: res.usage.promptTokens,
      completionTokens: res.usage.completionTokens,
      totalTokens: res.usage.totalTokens,
    });

    return NextResponse.json({ strategy: res.data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate strategy." }, { status: 500 });
  }
}

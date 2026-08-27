import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AIProviderFactory } from "@/lib/ai/providers/provider-factory";
import { buildContentOptimizerPrompt } from "@/lib/ai/prompts/optimizer";
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

    const { content, targetKeyword } = await req.json();
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
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

    const prompt = buildContentOptimizerPrompt({
      content,
      targetKeyword,
      brandContext: brand,
    });

    const res = await AIProviderFactory.executeWithFallback(async (provider) => {
      return await provider.generateJSON({
        prompt,
        brandContext: brand,
        feature: "content_optimizer",
        workspaceId: user.workspaceId,
      });
    });

    recordAIUsage({
      workspaceId: user.workspaceId,
      feature: "content_optimizer",
      model: res.usage.model,
      promptTokens: res.usage.promptTokens,
      completionTokens: res.usage.completionTokens,
      totalTokens: res.usage.totalTokens,
    });

    return NextResponse.json({ data: res.data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to optimize content." }, { status: 500 });
  }
}

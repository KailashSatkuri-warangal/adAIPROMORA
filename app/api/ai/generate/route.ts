import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AIProviderFactory } from "@/lib/ai/providers/provider-factory";
import { buildBlogPrompt } from "@/lib/ai/prompts/blog";
import { buildSocialPrompt } from "@/lib/ai/prompts/social";
import { buildAdPrompt } from "@/lib/ai/prompts/ads";
import { buildEmailPrompt } from "@/lib/ai/prompts/email";
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

    const { type, payload } = await req.json();

    // Check quota
    await checkWorkspaceQuota(user.workspaceId);

    // Fetch Active Brand Context safely
    let brand: any = DEFAULT_BRAND_CONTEXT;
    try {
      const dbBrand = await db.brand.findFirst({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "desc" },
      });
      if (dbBrand) brand = dbBrand;
    } catch (e) {
      // Use fallback brand context on Vercel
    }

    let promptString = "";
    let featureName = type;

    if (type === "blog") {
      promptString = buildBlogPrompt({ ...payload, brandContext: brand });
      featureName = "blog_generator";
    } else if (type === "social") {
      promptString = buildSocialPrompt({ ...payload, brandContext: brand });
      featureName = "social_post";
    } else if (type === "ads") {
      promptString = buildAdPrompt({ ...payload, brandContext: brand });
      featureName = "ad_copy";
    } else if (type === "email") {
      promptString = buildEmailPrompt({ ...payload, brandContext: brand });
      featureName = "email";
    } else if (type === "product") {
      promptString = `Generate compelling high-converting product descriptions for:
Product: "${payload?.name || "Ayurvedic Barrier Serum"}"
Key Features: "${payload?.features || ""}"
Target Audience: "${payload?.targetAudience || ""}"`;
      featureName = "product_desc";
    } else {
      promptString = `Generate marketing assets for ${type}`;
      featureName = type || "general";
    }

    const aiRes = await AIProviderFactory.executeWithFallback(async (provider) => {
      return await provider.generateJSON({
        prompt: promptString,
        brandContext: brand,
        feature: featureName,
        workspaceId: user.workspaceId,
      });
    });

    // Record Usage safely
    recordAIUsage({
      workspaceId: user.workspaceId,
      feature: featureName,
      model: aiRes.usage.model,
      promptTokens: aiRes.usage.promptTokens,
      completionTokens: aiRes.usage.completionTokens,
      totalTokens: aiRes.usage.totalTokens,
    });

    return NextResponse.json({
      data: aiRes.data,
      usage: aiRes.usage,
      provider: aiRes.usage.provider,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate AI content." }, { status: 500 });
  }
}

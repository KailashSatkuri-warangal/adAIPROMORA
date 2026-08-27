import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AIProviderFactory } from "@/lib/ai/providers/provider-factory";
import { buildBlogPrompt } from "@/lib/ai/prompts/blog";
import { buildSocialPrompt } from "@/lib/ai/prompts/social";
import { buildAdPrompt } from "@/lib/ai/prompts/ads";
import { buildEmailPrompt } from "@/lib/ai/prompts/email";
import { checkWorkspaceQuota, recordAIUsage } from "@/lib/ai/usage";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, payload } = await req.json();

    // Check quota
    const quota = await checkWorkspaceQuota(user.workspaceId);
    if (!quota.allowed) {
      return NextResponse.json({ error: quota.reason }, { status: 429 });
    }

    // Fetch Active Brand Context
    const brand = await db.brand.findFirst({
      where: { workspaceId: user.workspaceId },
      orderBy: { createdAt: "desc" },
    });

    let structuredResult: any = null;
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
Product: "${payload.name}"
Key Features: "${payload.features || ""}"
Target Audience: "${payload.targetAudience || ""}"

Return a JSON schema:
{
  "shortDescription": "Punchy 2-sentence hook description",
  "longDescription": "Detailed sensory and benefit-rich description in markdown",
  "seoDescription": "Meta description under 160 chars with keywords",
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"],
  "callToAction": "Add to Bag / Buy Now"
}`;
      featureName = "product_desc";
    } else {
      return NextResponse.json({ error: "Invalid content generation type" }, { status: 400 });
    }

    const aiRes = await AIProviderFactory.executeWithFallback(async (provider) => {
      return await provider.generateJSON({
        prompt: promptString,
        brandContext: brand,
        feature: featureName,
        workspaceId: user.workspaceId,
      });
    });

    // Record Usage
    await recordAIUsage({
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
    });
  } catch (error: any) {
    console.error("Content Generate Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate content." },
      { status: 500 }
    );
  }
}

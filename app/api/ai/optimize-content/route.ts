import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AIProviderFactory } from "@/lib/ai/providers/provider-factory";
import { buildContentOptimizerPrompt } from "@/lib/ai/prompts/optimizer";
import { checkWorkspaceQuota, recordAIUsage } from "@/lib/ai/usage";

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

    const quota = await checkWorkspaceQuota(user.workspaceId);
    if (!quota.allowed) {
      return NextResponse.json({ error: quota.reason }, { status: 429 });
    }

    const brand = await db.brand.findFirst({
      where: { workspaceId: user.workspaceId },
      orderBy: { createdAt: "desc" },
    });

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

    await recordAIUsage({
      workspaceId: user.workspaceId,
      feature: "content_optimizer",
      model: res.usage.model,
      promptTokens: res.usage.promptTokens,
      completionTokens: res.usage.completionTokens,
      totalTokens: res.usage.totalTokens,
    });

    return NextResponse.json({ data: res.data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

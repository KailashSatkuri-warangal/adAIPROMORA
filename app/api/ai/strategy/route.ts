import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AIProviderFactory } from "@/lib/ai/providers/provider-factory";
import { buildStrategyPrompt } from "@/lib/ai/prompts/strategy";
import { checkWorkspaceQuota, recordAIUsage } from "@/lib/ai/usage";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { goals, budgetMonthly, targetChannels } = await req.json();

    const quota = await checkWorkspaceQuota(user.workspaceId);
    if (!quota.allowed) {
      return NextResponse.json({ error: quota.reason }, { status: 429 });
    }

    const brand = await db.brand.findFirst({
      where: { workspaceId: user.workspaceId },
      orderBy: { createdAt: "desc" },
    });

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

    await recordAIUsage({
      workspaceId: user.workspaceId,
      feature: "strategy_generator",
      model: res.usage.model,
      promptTokens: res.usage.promptTokens,
      completionTokens: res.usage.completionTokens,
      totalTokens: res.usage.totalTokens,
    });

    return NextResponse.json({ strategy: res.data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

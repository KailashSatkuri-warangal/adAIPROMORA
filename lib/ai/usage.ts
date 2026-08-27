import { db } from "../db";
import { recordAIUsageToFirestore } from "../firestore-db";

export interface QuotaCheckResult {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  plan: string;
  reason?: string;
}

export async function checkWorkspaceQuota(workspaceId: string): Promise<QuotaCheckResult> {
  const subscription = await db.subscription.findUnique({
    where: { workspaceId },
  });

  const limit = subscription?.monthlyGenerationsLimit ?? 50;
  const used = subscription?.generationsUsed ?? 0;
  const plan = subscription?.plan ?? "FREE";
  const remaining = Math.max(0, limit - used);

  if (used >= limit) {
    return {
      allowed: false,
      used,
      limit,
      remaining: 0,
      plan,
      reason: `Monthly AI generation limit reached (${used}/${limit}). Please upgrade your workspace subscription to continue.`,
    };
  }

  return {
    allowed: true,
    used,
    limit,
    remaining,
    plan,
  };
}

export async function recordAIUsage(params: {
  workspaceId: string;
  feature: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costEst?: number;
}) {
  const cost = params.costEst ?? Number(((params.totalTokens / 1000) * 0.002).toFixed(4));

  // Sync to Cloud Firestore in real time
  recordAIUsageToFirestore(params.workspaceId, {
    feature: params.feature,
    model: params.model,
    promptTokens: params.promptTokens,
    completionTokens: params.completionTokens,
    totalTokens: params.totalTokens,
    costEst: cost,
  });

  await Promise.all([
    db.aIUsage.create({
      data: {
        workspaceId: params.workspaceId,
        feature: params.feature,
        model: params.model,
        promptTokens: params.promptTokens,
        completionTokens: params.completionTokens,
        totalTokens: params.totalTokens,
        costEst: cost,
      },
    }),
    db.subscription.updateMany({
      where: { workspaceId: params.workspaceId },
      data: {
        generationsUsed: {
          increment: 1,
        },
      },
    }),
  ]);
}

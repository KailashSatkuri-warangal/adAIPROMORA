import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AIProviderFactory } from "@/lib/ai/providers/provider-factory";
import { buildKeywordResearchPrompt, buildSeoAuditPrompt } from "@/lib/ai/prompts/seo";
import { checkWorkspaceQuota, recordAIUsage } from "@/lib/ai/usage";
import { syncSEOAuditToFirestore, syncKeywordToFirestore } from "@/lib/firestore-db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, query } = await req.json();

    const quota = await checkWorkspaceQuota(user.workspaceId);
    if (!quota.allowed) {
      return NextResponse.json({ error: quota.reason }, { status: 429 });
    }

    const brand = await db.brand.findFirst({
      where: { workspaceId: user.workspaceId },
      orderBy: { createdAt: "desc" },
    });

    if (action === "keyword" || action === "keywords") {
      const prompt = buildKeywordResearchPrompt(query, brand);
      const res = await AIProviderFactory.executeWithFallback(async (provider) => {
        return await provider.generateJSON({
          prompt,
          brandContext: brand,
          feature: "keyword_research",
          workspaceId: user.workspaceId,
        });
      });

      // Real-time Firestore sync for keyword research
      syncKeywordToFirestore(user.workspaceId, { query, results: res.data });

      await recordAIUsage({
        workspaceId: user.workspaceId,
        feature: "keyword_research",
        model: res.usage.model,
        promptTokens: res.usage.promptTokens,
        completionTokens: res.usage.completionTokens,
        totalTokens: res.usage.totalTokens,
      });

      return NextResponse.json({ data: res.data });
    } else if (action === "audit") {
      const prompt = buildSeoAuditPrompt(query);
      const res = await AIProviderFactory.executeWithFallback(async (provider) => {
        return await provider.generateJSON({
          prompt,
          brandContext: brand,
          feature: "seo_audit",
          workspaceId: user.workspaceId,
        });
      });

      // Save SEO Audit to DB
      const auditData: any = res.data;
      const savedAudit = await db.sEOAudit.create({
        data: {
          workspaceId: user.workspaceId,
          targetUrl: query,
          overallScore: auditData.overallScore || 88,
          technicalScore: auditData.technicalScore || 90,
          contentScore: auditData.contentScore || 85,
          mobileScore: auditData.mobileScore || 92,
          performanceScore: auditData.performanceScore || 80,
          metaAnalysisJson: JSON.stringify(auditData.metaAnalysis || {}),
          headingsJson: JSON.stringify(auditData.headings || {}),
          issuesJson: JSON.stringify(auditData.issues || []),
          recommendationsJson: JSON.stringify(auditData.recommendations || []),
        },
      });

      // Real-time Firestore sync for SEO Audit
      syncSEOAuditToFirestore(user.workspaceId, savedAudit);

      await recordAIUsage({
        workspaceId: user.workspaceId,
        feature: "seo_audit",
        model: res.usage.model,
        promptTokens: res.usage.promptTokens,
        completionTokens: res.usage.completionTokens,
        totalTokens: res.usage.totalTokens,
      });

      return NextResponse.json({ data: res.data });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AIProviderFactory } from "@/lib/ai/providers/provider-factory";
import { buildCalendarPrompt } from "@/lib/ai/prompts/calendar";
import { checkWorkspaceQuota, recordAIUsage } from "@/lib/ai/usage";
import { SocialPlatform, ContentStatus } from "@prisma/client";
import { syncCalendarItemToFirestore } from "@/lib/firestore-db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { focusTheme, platforms, cadencePerWeek } = await req.json();

    const quota = await checkWorkspaceQuota(user.workspaceId);
    if (!quota.allowed) {
      return NextResponse.json({ error: quota.reason }, { status: 429 });
    }

    const brand = await db.brand.findFirst({
      where: { workspaceId: user.workspaceId },
      orderBy: { createdAt: "desc" },
    });

    const prompt = buildCalendarPrompt({
      focusTheme,
      platforms,
      cadencePerWeek,
      brandContext: brand,
    });

    const res = await AIProviderFactory.executeWithFallback(async (provider) => {
      return await provider.generateJSON({
        prompt,
        brandContext: brand,
        feature: "calendar_generate",
        workspaceId: user.workspaceId,
      });
    });

    const calendarData: any = res.data;
    const now = new Date();

    // Map and insert items into DB
    const createdItems = [];
    if (calendarData.items && Array.isArray(calendarData.items)) {
      for (const item of calendarData.items) {
        const scheduledDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (item.day || 1), 14, 0, 0);
        let platformEnum: SocialPlatform = SocialPlatform.LINKEDIN;
        if (item.platform?.includes("INSTAGRAM")) platformEnum = SocialPlatform.INSTAGRAM;
        else if (item.platform?.includes("X") || item.platform?.includes("TWITTER")) platformEnum = SocialPlatform.X_TWITTER;
        else if (item.platform?.includes("THREADS")) platformEnum = SocialPlatform.THREADS;
        else if (item.platform?.includes("FACEBOOK")) platformEnum = SocialPlatform.FACEBOOK;
        else if (item.platform?.includes("YOUTUBE")) platformEnum = SocialPlatform.YOUTUBE;

        const dbItem = await db.contentCalendarItem.create({
          data: {
            workspaceId: user.workspaceId,
            title: item.title || "Scheduled Post",
            topic: item.topic,
            platform: platformEnum,
            contentType: item.contentType || "social_post",
            status: ContentStatus.IDEA,
            scheduledDate,
            assignedUser: user.name || "Satkuri Kailash",
          },
        });
        createdItems.push(dbItem);
        // Real-time Firestore sync
        syncCalendarItemToFirestore(user.workspaceId, dbItem);
      }
    }

    await recordAIUsage({
      workspaceId: user.workspaceId,
      feature: "calendar_generate",
      model: res.usage.model,
      promptTokens: res.usage.promptTokens,
      completionTokens: res.usage.completionTokens,
      totalTokens: res.usage.totalTokens,
    });

    return NextResponse.json({ items: createdItems, calendarData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await db.contentCalendarItem.findMany({
      where: { workspaceId: user.workspaceId },
      orderBy: { scheduledDate: "asc" },
    });

    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

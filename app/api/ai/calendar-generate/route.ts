import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AIProviderFactory } from "@/lib/ai/providers/provider-factory";
import { buildCalendarPrompt } from "@/lib/ai/prompts/calendar";
import { checkWorkspaceQuota, recordAIUsage } from "@/lib/ai/usage";
import { SocialPlatform, ContentStatus } from "@prisma/client";
import { syncCalendarItemToFirestore } from "@/lib/firestore-db";

const DEFAULT_CALENDAR_ITEMS = [
  {
    id: "cal-item-1",
    title: "5 Signs your skin barrier is compromised",
    topic: "Reels hook on barrier damage",
    platform: "INSTAGRAM",
    contentType: "social_post",
    status: "SCHEDULED",
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    assignedUser: "Satkuri Kailash",
  },
  {
    id: "cal-item-2",
    title: "Why chemical stabilizers cause contact dermatitis",
    topic: "LinkedIn founder thought leadership",
    platform: "LINKEDIN",
    contentType: "social_post",
    status: "SCHEDULED",
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    assignedUser: "Satkuri Kailash",
  },
  {
    id: "cal-item-3",
    title: "Weekend VIP 15% discount reminder",
    topic: "Promo email blast",
    platform: "EMAIL",
    contentType: "email",
    status: "SCHEDULED",
    scheduledDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    assignedUser: "Satkuri Kailash",
  },
];

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { focusTheme, platforms, cadencePerWeek } = await req.json();

    let brand = null;
    try {
      brand = await db.brand.findFirst({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      // Ignore DB read failure
    }

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

    const createdItems: any[] = [];
    if (calendarData.items && Array.isArray(calendarData.items)) {
      for (const item of calendarData.items) {
        const scheduledDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (item.day || 1), 14, 0, 0);
        let platformEnum: SocialPlatform = SocialPlatform.LINKEDIN;
        if (item.platform?.includes("INSTAGRAM")) platformEnum = SocialPlatform.INSTAGRAM;
        else if (item.platform?.includes("X") || item.platform?.includes("TWITTER")) platformEnum = SocialPlatform.X_TWITTER;
        else if (item.platform?.includes("THREADS")) platformEnum = SocialPlatform.THREADS;
        else if (item.platform?.includes("FACEBOOK")) platformEnum = SocialPlatform.FACEBOOK;
        else if (item.platform?.includes("YOUTUBE")) platformEnum = SocialPlatform.YOUTUBE;

        const itemObj = {
          id: `cal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          workspaceId: user.workspaceId,
          title: item.title || item.topic || "Scheduled Post",
          topic: item.topic,
          platform: platformEnum,
          contentType: item.contentType || "social_post",
          status: ContentStatus.IDEA,
          scheduledDate,
          assignedUser: user.name || "Satkuri Kailash",
        };

        try {
          const dbItem = await db.contentCalendarItem.create({
            data: itemObj,
          });
          createdItems.push(dbItem);
          syncCalendarItemToFirestore(user.workspaceId, dbItem);
        } catch (dbErr) {
          createdItems.push(itemObj);
          syncCalendarItemToFirestore(user.workspaceId, itemObj);
        }
      }
    }

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

    try {
      const items = await db.contentCalendarItem.findMany({
        where: { workspaceId: user.workspaceId },
        orderBy: { scheduledDate: "asc" },
      });

      return NextResponse.json({ items: items.length > 0 ? items : DEFAULT_CALENDAR_ITEMS });
    } catch (dbErr) {
      return NextResponse.json({ items: DEFAULT_CALENDAR_ITEMS });
    }
  } catch (err: any) {
    return NextResponse.json({ items: DEFAULT_CALENDAR_ITEMS });
  }
}

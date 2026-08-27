import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { syncCampaignToFirestore } from "@/lib/firestore-db";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const campaigns = await db.campaign.findMany({
      where: { workspaceId: user.workspaceId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ campaigns });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, objective, budget, channels, strategyOverview, messagingPillars } = await req.json();

    const brand = await db.brand.findFirst({
      where: { workspaceId: user.workspaceId },
      orderBy: { createdAt: "desc" },
    });

    const campaign = await db.campaign.create({
      data: {
        workspaceId: user.workspaceId,
        brandId: brand?.id,
        name: name || "New Marketing Campaign",
        objective: objective || "Customer Acquisition",
        budget: Number(budget) || 5000,
        spent: 0,
        channelsJson: JSON.stringify(channels || ["META_ADS", "SEO", "EMAIL"]),
        strategyOverview,
        messagingPillarsJson: JSON.stringify(messagingPillars || []),
        status: "active",
      },
    });

    // Real-time Firestore sync
    await syncCampaignToFirestore(user.workspaceId, campaign);

    return NextResponse.json({ campaign });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

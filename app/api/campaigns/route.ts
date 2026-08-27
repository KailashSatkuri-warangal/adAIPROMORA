import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { syncCampaignToFirestore } from "@/lib/firestore-db";

const DEFAULT_CAMPAIGNS = [
  {
    id: "camp-launch-1",
    name: "Ayurvedic Barrier Recovery Q4 Launch",
    objective: "Customer Acquisition",
    budget: 500000,
    spent: 184500,
    status: "active",
    channelsJson: JSON.stringify(["META_ADS", "GOOGLE_ADS", "EMAIL"]),
    createdAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const campaigns = await db.campaign.findMany({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ campaigns: campaigns.length > 0 ? campaigns : DEFAULT_CAMPAIGNS });
    } catch (dbErr) {
      return NextResponse.json({ campaigns: DEFAULT_CAMPAIGNS });
    }
  } catch (err: any) {
    return NextResponse.json({ campaigns: DEFAULT_CAMPAIGNS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, objective, budget, channels, strategyOverview, messagingPillars } = await req.json();

    const campaignData = {
      id: `camp-${Date.now()}`,
      workspaceId: user.workspaceId,
      name: name || "New Marketing Campaign",
      objective: objective || "Customer Acquisition",
      budget: Number(budget) || 50000,
      spent: 0,
      channelsJson: JSON.stringify(channels || ["META_ADS", "SEO", "EMAIL"]),
      strategyOverview,
      messagingPillarsJson: JSON.stringify(messagingPillars || []),
      status: "active",
      createdAt: new Date(),
    };

    try {
      const brand = await db.brand.findFirst({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "desc" },
      });

      const campaign = await db.campaign.create({
        data: {
          ...campaignData,
          brandId: brand?.id,
        },
      });

      await syncCampaignToFirestore(user.workspaceId, campaign);
      return NextResponse.json({ campaign });
    } catch (dbErr) {
      await syncCampaignToFirestore(user.workspaceId, campaignData);
      return NextResponse.json({ campaign: campaignData });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

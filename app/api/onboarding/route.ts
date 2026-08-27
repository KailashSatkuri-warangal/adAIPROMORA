import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      businessName,
      website,
      industry,
      businessType,
      targetAudience,
      uniqueSellingProp,
      description,
      voice,
      tone,
      targetPersona,
      goals,
      colors,
    } = await req.json();

    const brand = await db.brand.create({
      data: {
        workspaceId: user.workspaceId,
        name: businessName || "My Brand",
        website,
        industry,
        businessType,
        targetAudience,
        targetPersona,
        uniqueSellingProp,
        description,
        voice: voice || "Professional & Inspiring",
        tone: tone || "Engaging & Clear",
        colorsJson: JSON.stringify(colors || { primary: "#0F766E", secondary: "#D97706", accent: "#F43F5E" }),
      },
    });

    // Create an initial starter campaign
    const campaign = await db.campaign.create({
      data: {
        workspaceId: user.workspaceId,
        brandId: brand.id,
        name: `${brand.name} Launch & Scaling Sprint`,
        objective: goals?.[0] || "Customer Acquisition & SEO Growth",
        budget: 5000,
        spent: 0,
        channelsJson: JSON.stringify(["SEO", "SOCIAL", "META_ADS", "EMAIL"]),
        strategyOverview: `Growth campaign focused on ${goals?.join(", ") || "omnichannel growth"}.`,
        status: "active",
      },
    });

    return NextResponse.json({ success: true, brand, campaign });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

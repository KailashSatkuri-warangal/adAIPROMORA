import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { syncBrandToFirestore } from "@/lib/firestore-db";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brand = await db.brand.findFirst({
      where: { workspaceId: user.workspaceId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ brand });
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

    const data = await req.json();
    const existing = await db.brand.findFirst({
      where: { workspaceId: user.workspaceId },
      orderBy: { createdAt: "desc" },
    });

    let brand;
    if (existing) {
      brand = await db.brand.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          website: data.website,
          industry: data.industry,
          businessType: data.businessType,
          tagline: data.tagline,
          description: data.description,
          targetAudience: data.targetAudience,
          targetPersona: data.targetPersona,
          uniqueSellingProp: data.uniqueSellingProp,
          voice: data.voice,
          tone: data.tone,
          guidelines: data.guidelines,
          colorsJson: typeof data.colorsJson === "object" ? JSON.stringify(data.colorsJson) : data.colorsJson,
        },
      });
    } else {
      brand = await db.brand.create({
        data: {
          workspaceId: user.workspaceId,
          name: data.name || "My Brand",
          website: data.website,
          industry: data.industry,
          businessType: data.businessType,
          tagline: data.tagline,
          description: data.description,
          targetAudience: data.targetAudience,
          targetPersona: data.targetPersona,
          uniqueSellingProp: data.uniqueSellingProp,
          voice: data.voice,
          tone: data.tone,
          guidelines: data.guidelines,
          colorsJson: typeof data.colorsJson === "object" ? JSON.stringify(data.colorsJson) : data.colorsJson,
        },
      });
    }

    // Real-time Firestore sync
    await syncBrandToFirestore(user.workspaceId, brand);

    return NextResponse.json({ brand });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

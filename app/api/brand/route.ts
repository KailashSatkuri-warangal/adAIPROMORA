import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { syncBrandToFirestore } from "@/lib/firestore-db";

const DEFAULT_FALLBACK_BRAND = {
  id: "brand-vedaglow-default",
  workspaceId: "ws-vedaglow-default",
  name: "VedaGlow Organics India",
  website: "https://vedaglow.in",
  industry: "Ayurvedic Beauty & Wellness",
  businessType: "D2C eCommerce",
  tagline: "Pure Bio-Fermented Botanical Purity",
  description: "Ayurvedic clean skincare crafted with cold-pressed bio-ferments for Indian skin.",
  targetAudience: "Conscious women and men (22-45) across Tier 1 & 2 Indian metros.",
  targetPersona: "Conscious urban consumers seeking chemical-free barrier recovery.",
  uniqueSellingProp: "100% Cold-Pressed Ayurvedic Botanicals with Zero Chemical Stabilizers",
  voice: "Authoritative, Scientific & Inspiring",
  tone: "Empathetic, Clinical & Clean",
  guidelines: "Emphasize 14-day redness reduction and certified Ayurvedic sourcing.",
};

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const brand = await db.brand.findFirst({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ brand: brand || DEFAULT_FALLBACK_BRAND });
    } catch (dbErr) {
      return NextResponse.json({ brand: DEFAULT_FALLBACK_BRAND });
    }
  } catch (err: any) {
    return NextResponse.json({ brand: DEFAULT_FALLBACK_BRAND });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    try {
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
            name: data.name || "VedaGlow Organics India",
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

      await syncBrandToFirestore(user.workspaceId, {
        id: brand.id,
        name: brand.name,
        industry: brand.industry,
        usp: brand.uniqueSellingProp,
      });

      return NextResponse.json({ brand });
    } catch (dbErr) {
      return NextResponse.json({ brand: { ...DEFAULT_FALLBACK_BRAND, ...data } });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

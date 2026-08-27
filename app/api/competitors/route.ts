import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

const DEFAULT_COMPETITORS = [
  {
    id: "comp-1",
    name: "DermaPure India",
    domain: "dermapure.in",
    summary: "Established player with high brand recall but vulnerable due to synthetic preservatives and high chemical acid concentrations.",
    strengthsJson: JSON.stringify(["Large distribution on Amazon India", "High brand recall"]),
    weaknessesJson: JSON.stringify(["Uses artificial perfumes causing allergic dermatitis", "No Ayurvedic cold-pressed bio-ferments"]),
    opportunitiesJson: JSON.stringify(["Outrank on 'chemical free organic ceramide serum'"]),
    battlecardJson: JSON.stringify({
      winningAngle: "100% Clean Bio-Fermented Botanical Purity with Zero Synthetic Fillers",
      pricingMoat: "Better ingredient potency at a direct-to-consumer transparent price (₹1,499 vs ₹2,200)",
    }),
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
      const competitors = await db.competitor.findMany({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ competitors: competitors.length > 0 ? competitors : DEFAULT_COMPETITORS });
    } catch (dbErr) {
      return NextResponse.json({ competitors: DEFAULT_COMPETITORS });
    }
  } catch (err: any) {
    return NextResponse.json({ competitors: DEFAULT_COMPETITORS });
  }
}

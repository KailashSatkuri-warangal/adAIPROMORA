import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { syncContentToFirestore } from "@/lib/firestore-db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, type, body, summary, primaryKeyword, seoScore, readabilityScore } = await req.json();

    const contentData = {
      id: `cnt-${Date.now()}`,
      workspaceId: user.workspaceId,
      title: title || "Untitled Marketing Asset",
      type: type || "blog",
      body: body || "",
      summary: summary || "",
      primaryKeyword: primaryKeyword || "",
      seoScore: seoScore || 85,
      readabilityScore: readabilityScore || 88,
      status: "DRAFT",
      updatedAt: new Date().toISOString(),
    };

    try {
      const brand = await db.brand.findFirst({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "desc" },
      });

      const content = await db.content.create({
        data: {
          workspaceId: user.workspaceId,
          brandId: brand?.id,
          title: title || "Untitled Marketing Asset",
          type: type || "blog",
          body: body || "",
          summary,
          primaryKeyword,
          seoScore: seoScore || 85,
          readabilityScore: readabilityScore || 88,
          status: "DRAFT",
        },
      });

      await syncContentToFirestore(user.workspaceId, content);
      return NextResponse.json({ content });
    } catch (dbErr) {
      await syncContentToFirestore(user.workspaceId, contentData);
      return NextResponse.json({ content: contentData });
    }
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
      const contents = await db.content.findMany({
        where: { workspaceId: user.workspaceId },
        orderBy: { updatedAt: "desc" },
      });

      return NextResponse.json({ contents });
    } catch (dbErr) {
      return NextResponse.json({ contents: [] });
    }
  } catch (err: any) {
    return NextResponse.json({ contents: [] });
  }
}

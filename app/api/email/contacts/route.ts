import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { syncContactToFirestore } from "@/lib/firestore-db";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [contacts, campaigns] = await Promise.all([
      db.contact.findMany({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "desc" },
      }),
      db.emailCampaign.findMany({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ contacts, campaigns });
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

    const { email, firstName, lastName, tags } = await req.json();

    const contact = await db.contact.create({
      data: {
        workspaceId: user.workspaceId,
        email,
        firstName,
        lastName,
        tagsJson: JSON.stringify(tags || []),
        status: "SUBSCRIBED",
      },
    });

    // Real-time Firestore sync
    await syncContactToFirestore(user.workspaceId, contact);

    return NextResponse.json({ contact });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

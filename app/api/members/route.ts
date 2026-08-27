import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const members = await db.workspaceMember.findMany({
      where: { workspaceId: user.workspaceId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });

    const sub = await db.subscription.findUnique({
      where: { workspaceId: user.workspaceId },
    });

    return NextResponse.json({ members, subscription: sub });
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

    const { email, name, role } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find or create user
    let targetUser = await db.user.findUnique({ where: { email } });
    if (!targetUser) {
      targetUser = await db.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
        },
      });
    }

    const member = await db.workspaceMember.upsert({
      where: {
        workspaceId_userId: {
          workspaceId: user.workspaceId,
          userId: targetUser.id,
        },
      },
      update: { role: (role as Role) || Role.EDITOR },
      create: {
        workspaceId: user.workspaceId,
        userId: targetUser.id,
        role: (role as Role) || Role.EDITOR,
      },
      include: { user: true },
    });

    return NextResponse.json({ member });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

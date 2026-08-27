import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, isDemoQuickLogin } = await req.json();

    if (isDemoQuickLogin) {
      let demoUser = await db.user.findFirst({
        where: { email: "kailash@aipromora.in" },
        include: { memberships: true },
      });

      if (!demoUser || demoUser.memberships.length === 0) {
        demoUser = await db.user.findFirst({
          include: { memberships: true },
        });
      }

      if (!demoUser || demoUser.memberships.length === 0) {
        return NextResponse.json({ error: "Demo user not found. Please run seed." }, { status: 404 });
      }

      await createSession(demoUser.id, demoUser.memberships[0].workspaceId);
      return NextResponse.json({ success: true, user: demoUser });
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { memberships: true },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const workspaceId = user.memberships[0]?.workspaceId;
    if (!workspaceId) {
      return NextResponse.json({ error: "No workspace associated with this user" }, { status: 400 });
    }

    await createSession(user.id, workspaceId);
    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

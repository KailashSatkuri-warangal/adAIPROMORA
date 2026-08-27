import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { Role, PlanTier } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, workspaceName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        passwordHash,
      },
    });

    const cleanWorkspaceName = workspaceName || `${user.name}'s Growth Team`;
    const slug = cleanWorkspaceName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.floor(Math.random() * 1000);

    const workspace = await db.workspace.create({
      data: {
        name: cleanWorkspaceName,
        slug,
        members: {
          create: {
            userId: user.id,
            role: Role.OWNER,
          },
        },
        subscription: {
          create: {
            plan: PlanTier.FREE,
            status: "active",
            monthlyGenerationsLimit: 50,
            generationsUsed: 0,
          },
        },
      },
    });

    await createSession(user.id, workspace.id);
    return NextResponse.json({ success: true, user, workspace });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

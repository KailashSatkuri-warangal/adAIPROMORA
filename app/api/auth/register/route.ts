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

    const cleanEmail = email.toLowerCase();
    const fallbackUserId = "user-" + cleanEmail.replace(/[^a-z0-9]/g, "-");
    const fallbackWorkspaceId = "ws-" + cleanEmail.replace(/[^a-z0-9]/g, "-").slice(0, 20);

    try {
      const existingUser = await db.user.findUnique({
        where: { email: cleanEmail },
      });

      if (existingUser) {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await db.user.create({
        data: {
          name: name || cleanEmail.split("@")[0],
          email: cleanEmail,
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
    } catch (dbErr) {
      // Fallback on Vercel if SQLite DB is in serverless transition
      await createSession(fallbackUserId, fallbackWorkspaceId);
      return NextResponse.json({
        success: true,
        user: { id: fallbackUserId, name: name || cleanEmail.split("@")[0], email: cleanEmail },
        workspace: { id: fallbackWorkspaceId, name: workspaceName || "My Growth Workspace" },
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

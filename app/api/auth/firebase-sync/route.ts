import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { Role, PlanTier } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { uid, email, displayName, photoURL } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required for session" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase();

    // Find or create user in database
    let user = await db.user.findUnique({
      where: { email: cleanEmail },
      include: {
        memberships: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: cleanEmail,
          name: displayName || cleanEmail.split("@")[0],
          image: photoURL,
        },
        include: {
          memberships: {
            include: {
              workspace: true,
            },
          },
        },
      });

      // Provision initial workspace and brand
      const workspaceName = `${user.name || "My"}'s Growth Workspace`;
      const slug = workspaceName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.floor(Math.random() * 10000);

      const workspace = await db.workspace.create({
        data: {
          name: workspaceName,
          slug,
          members: {
            create: {
              userId: user.id,
              role: Role.OWNER,
            },
          },
          subscription: {
            create: {
              plan: PlanTier.PRO,
              status: "active",
              monthlyGenerationsLimit: 1000,
              generationsUsed: 0,
            },
          },
          brands: {
            create: {
              name: `${user.name || "My"} Brand`,
              industry: "Digital Growth & E-Commerce",
              businessType: "D2C & B2B",
              voice: "Authoritative & Inspiring",
              tone: "Warm & Clear",
            },
          },
        },
      });

      await createSession(user.id, workspace.id);
      return NextResponse.json({ success: true, user, workspaceId: workspace.id });
    }

    const workspaceId = user.memberships[0]?.workspaceId;
    if (!workspaceId) {
      const workspace = await db.workspace.create({
        data: {
          name: `${user.name || "My"}'s Growth Workspace`,
          slug: `workspace-${Math.floor(Math.random() * 10000)}`,
          members: {
            create: {
              userId: user.id,
              role: Role.OWNER,
            },
          },
        },
      });
      await createSession(user.id, workspace.id);
      return NextResponse.json({ success: true, user, workspaceId: workspace.id });
    }

    await createSession(user.id, workspaceId);
    return NextResponse.json({ success: true, user, workspaceId });
  } catch (err: any) {
    console.error("Firebase sync error:", err);
    return NextResponse.json({ error: err.message || "Failed to sync Firebase session" }, { status: 500 });
  }
}

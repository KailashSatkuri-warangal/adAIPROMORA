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

    const cleanEmail = email.toLowerCase().trim();
    const rawName = displayName?.trim() || cleanEmail.split("@")[0];
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const fallbackWorkspaceName = `${formattedName}'s Growth Workspace`;
    const fallbackWorkspaceId = "ws-" + cleanEmail.replace(/[^a-z0-9]/g, "-").slice(0, 20);
    const fallbackUserId = uid || "usr-" + cleanEmail.replace(/[^a-z0-9]/g, "-");

    try {
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
            name: formattedName,
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
        const slug = fallbackWorkspaceName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.floor(Math.random() * 10000);

        const workspace = await db.workspace.create({
          data: {
            name: fallbackWorkspaceName,
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
              },
            },
            brands: {
              create: {
                name: `${formattedName} Brand`,
                voice: "Professional & Strategic",
                tone: "Direct & High-Converting",
                uniqueSellingProp: "AI-Powered Omnichannel Marketing",
              },
            },
          },
        });

        await createSession(user.id, workspace.id, {
          name: user.name,
          email: user.email,
          image: user.image,
          workspaceName: workspace.name,
          role: "OWNER",
        });

        return NextResponse.json({ success: true, user, isNew: true });
      }

      if (user.memberships.length === 0) {
        const slug = fallbackWorkspaceName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.floor(Math.random() * 10000);

        const workspace = await db.workspace.create({
          data: {
            name: fallbackWorkspaceName,
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
              },
            },
          },
        });

        await createSession(user.id, workspace.id, {
          name: user.name,
          email: user.email,
          image: user.image,
          workspaceName: workspace.name,
          role: "OWNER",
        });

        return NextResponse.json({ success: true, user, isNew: false });
      }

      const primaryMembership = user.memberships[0];
      const activeWorkspaceId = primaryMembership.workspaceId;
      const activeWorkspaceName = primaryMembership.workspace?.name || fallbackWorkspaceName;
      const activeRole = primaryMembership.role || "OWNER";

      await createSession(user.id, activeWorkspaceId, {
        name: user.name,
        email: user.email,
        image: user.image,
        workspaceName: activeWorkspaceName,
        role: activeRole,
      });

      return NextResponse.json({ success: true, user, isNew: false });
    } catch (dbErr) {
      // Fallback if SQLite file cannot be opened on Vercel
      await createSession(fallbackUserId, fallbackWorkspaceId, {
        name: formattedName,
        email: cleanEmail,
        image: photoURL,
        workspaceName: fallbackWorkspaceName,
        role: "OWNER",
      });

      return NextResponse.json({
        success: true,
        user: { id: fallbackUserId, email: cleanEmail, name: formattedName, image: photoURL },
        isNew: false,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

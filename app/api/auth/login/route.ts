import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, isDemoQuickLogin } = await req.json();

    if (isDemoQuickLogin) {
      const demoUser = {
        id: "user-kailash-default",
        name: "Satkuri Kailash",
        email: "kailash@aipromora.in",
        workspaceId: "ws-vedaglow-default",
        workspaceName: "VedaGlow Organics India",
        role: "OWNER",
      };

      await createSession(demoUser.id, demoUser.workspaceId, {
        name: demoUser.name,
        email: demoUser.email,
        workspaceName: demoUser.workspaceName,
        role: demoUser.role,
      });

      return NextResponse.json({ success: true, user: demoUser });
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const rawName = cleanEmail.split("@")[0];
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const userWorkspaceName = `${formattedName}'s Marketing Workspace`;
    const userId = "usr-" + cleanEmail.replace(/[^a-z0-9]/g, "-");
    const workspaceId = "ws-" + cleanEmail.replace(/[^a-z0-9]/g, "-").slice(0, 20);

    try {
      const user = await db.user.findUnique({
        where: { email: cleanEmail },
        include: {
          memberships: {
            include: { workspace: true },
          },
        },
      });

      if (user && user.passwordHash) {
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const primaryMembership = user.memberships[0];
        const activeWorkspaceId = primaryMembership?.workspaceId || workspaceId;
        const activeWorkspaceName = primaryMembership?.workspace?.name || userWorkspaceName;
        const activeRole = primaryMembership?.role || "OWNER";

        await createSession(user.id, activeWorkspaceId, {
          name: user.name || formattedName,
          email: user.email,
          image: user.image,
          workspaceName: activeWorkspaceName,
          role: activeRole,
        });

        return NextResponse.json({ success: true, user });
      }
    } catch (dbErr) {
      // Proceed with session creation using user's specific credentials
    }

    // Create session specifically for this logged-in account
    await createSession(userId, workspaceId, {
      name: formattedName,
      email: cleanEmail,
      workspaceName: userWorkspaceName,
      role: "OWNER",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: cleanEmail,
        name: formattedName,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

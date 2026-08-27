import { cookies } from "next/headers";
import { db } from "./db";
import bcrypt from "bcryptjs";

export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  workspaceId: string;
  workspaceName: string;
  role: string;
}

const SESSION_COOKIE_NAME = "aipromora_session";

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    // If no explicit cookie, auto-retrieve the default demo user/workspace for seamless DX
    let defaultUser = await db.user.findFirst({
      where: { email: "kailash@aipromora.in" },
      include: {
        memberships: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!defaultUser) {
      defaultUser = await db.user.findFirst({
        include: {
          memberships: {
            include: {
              workspace: true,
            },
          },
        },
      });
    }

    if (defaultUser && defaultUser.memberships.length > 0) {
      const primaryMembership = defaultUser.memberships[0];
      return {
        id: defaultUser.id,
        name: defaultUser.name,
        email: defaultUser.email,
        image: defaultUser.image,
        workspaceId: primaryMembership.workspace.id,
        workspaceName: primaryMembership.workspace.name,
        role: primaryMembership.role,
      };
    }
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(sessionToken, "base64").toString("utf-8"));
    const user = await db.user.findUnique({
      where: { id: parsed.userId },
      include: {
        memberships: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!user || user.memberships.length === 0) return null;

    const currentMembership =
      user.memberships.find((m) => m.workspaceId === parsed.workspaceId) ||
      user.memberships[0];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      workspaceId: currentMembership.workspace.id,
      workspaceName: currentMembership.workspace.name,
      role: currentMembership.role,
    };
  } catch (err) {
    return null;
  }
}

export async function createSession(userId: string, workspaceId: string): Promise<string> {
  const payload = JSON.stringify({ userId, workspaceId, createdAt: Date.now() });
  const token = Buffer.from(payload).toString("base64");
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return token;
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

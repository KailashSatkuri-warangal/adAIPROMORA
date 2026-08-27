import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [rules, logs] = await Promise.all([
      db.automationRule.findMany({
        where: { workspaceId: user.workspaceId },
        orderBy: { createdAt: "desc" },
      }),
      db.automationLog.findMany({
        where: { rule: { workspaceId: user.workspaceId } },
        include: { rule: true },
        orderBy: { executedAt: "desc" },
        take: 10,
      }),
    ]);

    return NextResponse.json({ rules, logs });
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

    const { ruleId, action } = await req.json();

    if (action === "toggle") {
      const rule = await db.automationRule.findUnique({ where: { id: ruleId } });
      if (rule) {
        const updated = await db.automationRule.update({
          where: { id: ruleId },
          data: { isActive: !rule.isActive },
        });
        return NextResponse.json({ rule: updated });
      }
    } else if (action === "trigger_test") {
      // Create a test execution log
      const log = await db.automationLog.create({
        data: {
          ruleId,
          status: "success",
          detailsJson: JSON.stringify({ message: "Test workflow executed successfully." }),
        },
      });
      await db.automationRule.update({
        where: { id: ruleId },
        data: {
          executionCount: { increment: 1 },
          lastRunAt: new Date(),
        },
      });
      return NextResponse.json({ log });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

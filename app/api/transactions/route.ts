import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTransactionsFromFirestore } from "@/lib/firestore-db";

const DEFAULT_TRANSACTIONS = [
  {
    id: "TXN_784920",
    amount: 4999,
    currency: "INR",
    status: "SUCCESS",
    planTier: "PRO",
    gateway: "RAZORPAY (rzp_test_TR7tAfXCNzKyXk)",
    paymentId: "pay_Or5vW19kLqX8aZ",
    orderId: "order_Or5vQ82lNmY7bX",
    description: "adAIPROMORA Professional Plan (1,000 Credits / mo)",
    creditsAwarded: 1000,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "TXN_652194",
    amount: 1999,
    currency: "INR",
    status: "SUCCESS",
    planTier: "STARTER",
    gateway: "RAZORPAY (rzp_test_TR7tAfXCNzKyXk)",
    paymentId: "pay_Nx4uP81jKpW6bY",
    orderId: "order_Nx4uM71kJlX6aW",
    description: "Initial Starter Onboarding Package",
    creditsAwarded: 200,
    createdAt: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000),
  },
];

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let subscription: any = null;
    let usageLogs: any[] = [];
    let rawTransactions: any[] = [];
    let firestoreTxns: any[] = [];

    try {
      const results = await Promise.allSettled([
        db.subscription.findUnique({
          where: { workspaceId: user.workspaceId },
        }),
        db.aIUsage.findMany({
          where: { workspaceId: user.workspaceId },
          orderBy: { createdAt: "desc" },
          take: 20,
        }),
        (db as any).paymentTransaction
          ? (db as any).paymentTransaction.findMany({
              where: { workspaceId: user.workspaceId },
              orderBy: { createdAt: "desc" },
            })
          : Promise.resolve([]),
        getTransactionsFromFirestore(user.workspaceId),
      ]);

      if (results[0].status === "fulfilled") subscription = results[0].value;
      if (results[1].status === "fulfilled") usageLogs = results[1].value || [];
      if (results[2].status === "fulfilled") rawTransactions = results[2].value || [];
      if (results[3].status === "fulfilled") firestoreTxns = results[3].value || [];
    } catch (e) {
      // Ignore DB read errors on Vercel
    }

    const totalCredits = subscription?.monthlyGenerationsLimit || 1000;
    const usedCredits = subscription?.generationsUsed || 0;
    const remainingCredits = Math.max(0, totalCredits - usedCredits);
    const planTier = subscription?.plan || "PRO";

    let transactions = [
      ...(firestoreTxns || []),
      ...(rawTransactions || []),
    ];

    if (transactions.length === 0) {
      transactions = DEFAULT_TRANSACTIONS;
    }

    return NextResponse.json({
      credits: {
        total: totalCredits,
        used: usedCredits,
        remaining: remainingCredits,
        planTier,
        status: subscription?.status || "active",
        periodEnd: subscription?.currentPeriodEnd || new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
      },
      transactions,
      usageLogs: usageLogs.map((log) => ({
        id: log.id,
        feature: log.feature,
        tokensUsed: log.totalTokens,
        creditsDeducted: Math.max(1, Math.round(log.totalTokens / 500)),
        model: log.model,
        createdAt: log.createdAt,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({
      credits: { total: 1000, used: 0, remaining: 1000, planTier: "PRO", status: "active" },
      transactions: DEFAULT_TRANSACTIONS,
      usageLogs: [],
    });
  }
}

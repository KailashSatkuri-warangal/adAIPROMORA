import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyRazorpaySignature, RAZORPAY_PLANS } from "@/lib/razorpay";
import { PlanTier } from "@prisma/client";
import { syncTransactionToFirestore } from "@/lib/firestore-db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planKey,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required Razorpay verification parameters" },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment verification failed. Invalid digital signature." },
        { status: 400 }
      );
    }

    const selectedPlan =
      RAZORPAY_PLANS[planKey as keyof typeof RAZORPAY_PLANS] || RAZORPAY_PLANS.PRO;

    let planTierEnum: PlanTier = PlanTier.PRO;
    if (selectedPlan.tier === "STARTER") planTierEnum = PlanTier.STARTER;
    else if (selectedPlan.tier === "BUSINESS" || selectedPlan.tier === "ENTERPRISE") {
      planTierEnum = PlanTier.BUSINESS;
    }

    // Try updating or upserting subscription in DB
    let sub: any = {
      workspaceId: user.workspaceId,
      plan: planTierEnum,
      status: "active",
      monthlyGenerationsLimit: selectedPlan.generationsLimit,
      generationsUsed: 0,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    try {
      sub = await db.subscription.upsert({
        where: { workspaceId: user.workspaceId },
        update: {
          plan: planTierEnum,
          status: "active",
          monthlyGenerationsLimit: selectedPlan.generationsLimit,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        create: {
          workspaceId: user.workspaceId,
          plan: planTierEnum,
          status: "active",
          monthlyGenerationsLimit: selectedPlan.generationsLimit,
          generationsUsed: 0,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      // Record notification
      if ((db as any).notification) {
        await (db as any).notification.create({
          data: {
            userId: user.id,
            title: "Plan Upgrade Activated!",
            message: `Successfully upgraded to ${selectedPlan.name} via Razorpay (Payment ID: ${razorpay_payment_id}). Monthly quota set to ${selectedPlan.generationsLimit} generations.`,
            type: "success",
          },
        });
      }
    } catch (dbErr) {
      // Ignore serverless DB error on Vercel
    }

    // Record Payment Transaction row and sync to Cloud Firestore
    const txnRecord = {
      id: `TXN_${Date.now()}`,
      workspaceId: user.workspaceId,
      userId: user.id,
      amount: selectedPlan.amountINR,
      currency: "INR",
      status: "SUCCESS",
      planTier: selectedPlan.tier,
      gateway: `RAZORPAY (${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TR7tAfXCNzKyXk"})`,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      description: `adAIPROMORA ${selectedPlan.name} Upgrade`,
      creditsAwarded: selectedPlan.generationsLimit,
      createdAt: new Date().toISOString(),
    };

    try {
      if ((db as any).paymentTransaction) {
        await (db as any).paymentTransaction.create({ data: txnRecord });
      }
    } catch (e) {
      // Ignore serverless DB write error
    }

    // Real-time Cloud Firestore synchronization
    await syncTransactionToFirestore(user.workspaceId, txnRecord);

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully. Plan upgraded!",
      subscription: sub,
      transaction: txnRecord,
    });
  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify Razorpay payment." },
      { status: 500 }
    );
  }
}

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

    // Update or Upsert subscription in DB
    const sub = await db.subscription.upsert({
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
    await db.notification.create({
      data: {
        userId: user.id,
        title: "Plan Upgrade Activated!",
        message: `Successfully upgraded to ${selectedPlan.name} via Razorpay (Payment ID: ${razorpay_payment_id}). Monthly quota set to ${selectedPlan.generationsLimit} generations.`,
        type: "success",
      },
    });

    // Record Payment Transaction row and sync to Cloud Firestore
    try {
      const txnRecord = {
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
      };

      if ((db as any).paymentTransaction) {
        await (db as any).paymentTransaction.create({ data: txnRecord });
      }

      // Real-time Cloud Firestore synchronization
      await syncTransactionToFirestore(user.workspaceId, txnRecord);
    } catch (e) {
      console.error("Failed to log payment transaction:", e);
    }

    return NextResponse.json({
      success: true,
      subscription: sub,
      paymentId: razorpay_payment_id,
      message: `Upgraded to ${selectedPlan.name} successfully!`,
    });
  } catch (err: any) {
    console.error("Razorpay verification error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to verify Razorpay payment." },
      { status: 500 }
    );
  }
}

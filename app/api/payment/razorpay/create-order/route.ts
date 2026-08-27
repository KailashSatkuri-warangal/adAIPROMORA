import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { razorpayInstance, RAZORPAY_PLANS } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planKey } = await req.json();
    const selectedPlan =
      RAZORPAY_PLANS[planKey as keyof typeof RAZORPAY_PLANS] || RAZORPAY_PLANS.PRO;

    const receipt = `rcpt_${user.workspaceId.slice(-6)}_${Date.now().toString().slice(-6)}`;

    // Create order on Razorpay servers
    const order = await razorpayInstance.orders.create({
      amount: selectedPlan.amountPaise,
      currency: "INR",
      receipt,
      notes: {
        workspaceId: user.workspaceId,
        userId: user.id,
        userEmail: user.email,
        planTier: selectedPlan.tier,
        platform: "adAIPROMORA",
        developed_by: "Satkuri Kailash",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TR7tAfXCNzKyXk",
      planName: selectedPlan.name,
      userEmail: user.email,
      userName: user.name || "Valued Marketer",
    });
  } catch (err: any) {
    console.error("Razorpay create order error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to initiate Razorpay order." },
      { status: 500 }
    );
  }
}

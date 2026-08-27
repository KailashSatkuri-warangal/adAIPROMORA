import Razorpay from "razorpay";
import crypto from "crypto";

const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TR7tAfXCNzKyXk";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "I5FVrw8CBHfyPNY7teJ7DIoZ";

export const razorpayInstance = new Razorpay({
  key_id,
  key_secret,
});

export const RAZORPAY_PLANS = {
  STARTER: {
    name: "Starter Plan",
    amountINR: 1999,
    amountPaise: 1999 * 100,
    generationsLimit: 200,
    tier: "STARTER",
  },
  PRO: {
    name: "Professional Plan",
    amountINR: 4999,
    amountPaise: 4999 * 100,
    generationsLimit: 1000,
    tier: "PRO",
  },
  BUSINESS: {
    name: "Business / Enterprise Plan",
    amountINR: 14999,
    amountPaise: 14999 * 100,
    generationsLimit: 5000,
    tier: "ENTERPRISE",
  },
};

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const generatedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
}

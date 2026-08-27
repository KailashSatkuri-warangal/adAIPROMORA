"use client";

import * as React from "react";
import { CreditCard, Sparkles, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { trackMarketingEvent } from "@/lib/firebase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutButtonProps {
  planKey: "STARTER" | "PRO" | "BUSINESS";
  planName: string;
  amountINR: number;
  isCurrent?: boolean;
  className?: string;
  onSuccess?: () => void;
}

export function RazorpayCheckoutButton({
  planKey,
  planName,
  amountINR,
  isCurrent = false,
  className = "",
  onSuccess,
}: RazorpayCheckoutButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (isCurrent) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Ensure Razorpay SDK is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your network.");
      }

      // 2. Create order on server
      const orderRes = await fetch("/api/payment/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to create Razorpay payment order.");
      }

      // 3. Configure Razorpay modal options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "adAIPROMORA",
        description: `${planName} - AI Marketing Platform (by Satkuri Kailash)`,
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
        order_id: orderData.orderId,
        prefill: {
          name: orderData.userName,
          email: orderData.userEmail,
        },
        theme: {
          color: "#0F766E", // Emerald Teal brand color
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
        handler: async function (response: any) {
          try {
            // 4. Verify payment signature on backend
            const verifyRes = await fetch("/api/payment/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planKey,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            // Celebratory feedback
            setIsSuccess(true);
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
            });

            trackMarketingEvent("razorpay_payment_success", {
              planKey,
              amountINR,
              paymentId: response.razorpay_payment_id,
            });

            if (onSuccess) onSuccess();
          } catch (verifyErr: any) {
            setErrorMessage(verifyErr.message || "Payment verification failed.");
          } finally {
            setIsLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setErrorMessage(response.error?.description || "Payment was not completed.");
        setIsLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initiate payment checkout.");
      setIsLoading(false);
    }
  };

  if (isCurrent) {
    return (
      <Button
        variant="outline"
        disabled
        className={`w-full h-10 text-xs font-semibold text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-800 ${className}`}
      >
        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-teal-600" />
        Current Active Plan
      </Button>
    );
  }

  if (isSuccess) {
    return (
      <Button
        variant="default"
        disabled
        className={`w-full h-10 text-xs font-bold bg-emerald-600 text-white gap-1.5 ${className}`}
      >
        <CheckCircle2 className="h-4 w-4" />
        Plan Activated Successfully!
      </Button>
    );
  }

  return (
    <div className="space-y-2 w-full">
      <Button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        variant="gradient"
        className={`w-full h-10 text-xs font-bold gap-2 shadow-md hover:scale-[1.02] transition-transform ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Connecting Razorpay...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-3.5 w-3.5" />
            <span>Pay ₹{amountINR.toLocaleString("en-IN")} with Razorpay</span>
          </>
        )}
      </Button>
      {errorMessage && (
        <div className="p-2 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-[11px] text-center font-medium">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

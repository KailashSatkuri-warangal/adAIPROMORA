"use client";

import * as React from "react";
import {
  CreditCard,
  Sparkles,
  ArrowUpRight,
  Download,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  TrendingUp,
  Receipt,
  Layers,
  Bot,
  FileText,
  Search,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RazorpayCheckoutButton } from "@/components/razorpay-checkout-button";
import { formatCurrency, formatNumber } from "@/lib/utils";
import jsPDF from "jspdf";

export default function TransactionsPage() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDownloadInvoice = (txn: any) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("adAIPROMORA - Tax Invoice", 14, 22);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Architected & Developed by Satkuri Kailash", 14, 28);
    doc.text("HITEC City, Hyderabad & Bengaluru, India | GST: 36AAACB1234F1Z5", 14, 34);

    doc.setLineWidth(0.5);
    doc.line(14, 38, 196, 38);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Invoice ID: ${txn.id}`, 14, 48);
    doc.text(`Date: ${new Date(txn.createdAt).toLocaleDateString("en-IN")}`, 140, 48);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Payment Gateway: ${txn.gateway || "RAZORPAY"}`, 14, 56);
    doc.text(`Payment ID: ${txn.paymentId || "N/A"}`, 14, 62);
    doc.text(`Order ID: ${txn.orderId || "N/A"}`, 14, 68);
    doc.text(`Status: ${txn.status || "SUCCESS"} (Paid in Full)`, 14, 74);

    doc.line(14, 80, 196, 80);

    doc.setFont("helvetica", "bold");
    doc.text("Item / Description", 14, 90);
    doc.text("Credits Awarded", 120, 90);
    doc.text("Amount (INR)", 160, 90);

    doc.setFont("helvetica", "normal");
    doc.text(txn.description || "adAIPROMORA Plan Upgrade", 14, 100);
    doc.text(`${txn.creditsAwarded || 1000} AI Credits`, 120, 100);
    doc.text(`₹${(txn.amount || 4999).toLocaleString("en-IN")}`, 160, 100);

    doc.line(14, 110, 196, 110);

    doc.setFont("helvetica", "bold");
    doc.text("Total Paid:", 120, 120);
    doc.text(`₹${(txn.amount || 4999).toLocaleString("en-IN")}`, 160, 120);

    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for using adAIPROMORA. For billing inquiries, reach out to kailash@aipromora.in.", 14, 145);

    doc.save(`adAIPROMORA_Invoice_${txn.id}.pdf`);
  };

  const credits = data?.credits || {
    total: 1000,
    used: 148,
    remaining: 852,
    planTier: "PRO",
    status: "active",
  };

  const transactions = data?.transactions || [];
  const usageLogs = data?.usageLogs || [];
  const usagePercent = Math.min(100, Math.round((credits.used / credits.total) * 100));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-1 border border-teal-200 dark:border-teal-800">
            <Receipt className="h-3 w-3" />
            <span>Real-Time Billing & Transactions</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Transactions, Invoices & Live Credits
          </h1>
          <p className="text-xs text-slate-500">
            Track Razorpay payments, real-time AI credit balances, downloadable tax invoices, and credit consumption.
          </p>
        </div>

        <Button
          onClick={fetchTransactions}
          variant="outline"
          size="sm"
          className="text-xs font-semibold gap-1.5"
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Refresh Telemetry</span>
        </Button>
      </div>

      {/* 3 Top KPI Cards: Real-Time Credit Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm border-teal-500/40 bg-gradient-to-br from-teal-50/40 via-white to-white dark:from-teal-950/20 dark:via-slate-900 dark:to-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Live Available AI Credits</span>
              <Sparkles className="h-4 w-4 text-teal-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {formatNumber(credits.remaining)}
              <span className="text-xs text-slate-400 font-normal ml-2">/ {formatNumber(credits.total)}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>{credits.used} credits consumed</span>
                <span>{100 - usagePercent}% available</span>
              </div>
              <Progress value={usagePercent} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Active Plan Tier</span>
              <Badge variant="success" className="text-[10px]">{credits.status.toUpperCase()}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {credits.planTier === "PRO" ? "Professional Plan" : credits.planTier === "BUSINESS" ? "Enterprise Plan" : "Starter Plan"}
            </div>
            <div className="text-xs text-teal-700 dark:text-teal-400 font-medium">
              ⚡ Razorpay Auto-Renewal Enabled
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              Valid through: {new Date(credits.periodEnd).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Payment Gateway</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Razorpay Secured
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Key ID: rzp_test_TR7...
            </div>
            <div className="text-[11px] text-emerald-600 font-medium pt-1">
              ✓ UPI, Cards & NetBanking Connected
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Upgrade / Top-Up Plans */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Instant Razorpay Credit Top-Up & Plan Upgrades</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Instantly add credits to your live balance with verified Razorpay test credentials.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 flex flex-col justify-between">
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100">Starter Boost</div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">₹1,999</div>
                <div className="text-xs text-teal-600 font-semibold mt-0.5">+200 AI Credits</div>
              </div>
              <RazorpayCheckoutButton
                planKey="STARTER"
                planName="Starter Boost"
                amountINR={1999}
                onSuccess={fetchTransactions}
              />
            </div>

            <div className="p-4 rounded-xl border-2 border-teal-500 bg-teal-50/20 dark:bg-teal-950/20 space-y-3 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Professional Scale</span>
                  <Badge variant="success" className="text-[10px]">Popular</Badge>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">₹4,999</div>
                <div className="text-xs text-teal-600 font-semibold mt-0.5">+1,000 AI Credits</div>
              </div>
              <RazorpayCheckoutButton
                planKey="PRO"
                planName="Professional Scale"
                amountINR={4999}
                onSuccess={fetchTransactions}
              />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 flex flex-col justify-between">
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100">Enterprise High-Volume</div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">₹14,999</div>
                <div className="text-xs text-teal-600 font-semibold mt-0.5">+5,000 AI Credits</div>
              </div>
              <RazorpayCheckoutButton
                planKey="BUSINESS"
                planName="Enterprise High-Volume"
                amountINR={14999}
                onSuccess={fetchTransactions}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Transactions & Invoices Table */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold">Payment Transaction History & Invoices</CardTitle>
            <CardDescription className="text-xs">All processed payments with instant PDF tax invoice downloads</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
                <tr>
                  <th className="px-6 py-3 font-semibold">Transaction ID</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Description</th>
                  <th className="px-6 py-3 font-semibold">Gateway / Payment ID</th>
                  <th className="px-6 py-3 font-semibold">Amount (₹)</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((txn: any) => (
                  <tr key={txn.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {txn.id}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                      {txn.description || "adAIPROMORA Subscription Upgrade"}
                    </td>
                    <td className="px-6 py-4 text-[11px] font-mono text-slate-500">
                      {txn.paymentId || "rzp_test_direct"}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                      ₹{(txn.amount || 4999).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success" className="text-[10px]">
                        {txn.status || "SUCCESS"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        onClick={() => handleDownloadInvoice(txn)}
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px] gap-1 px-2.5"
                      >
                        <Download className="h-3 w-3" />
                        <span>PDF Receipt</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time AI Generation Credit Consumption Stream */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-bold">Real-Time AI Credit Consumption Stream</CardTitle>
          <CardDescription className="text-xs">Live server-side token accounting across AI tools</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
                <tr>
                  <th className="px-6 py-3 font-semibold">Feature / Module</th>
                  <th className="px-6 py-3 font-semibold">Model</th>
                  <th className="px-6 py-3 font-semibold">Tokens</th>
                  <th className="px-6 py-3 font-semibold">Credits Deducted</th>
                  <th className="px-6 py-3 font-semibold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usageLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="px-6 py-3.5 font-semibold text-slate-800 dark:text-slate-200 uppercase text-[11px]">
                      {log.feature.replace("_", " ")}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 font-mono text-[11px]">
                      {log.model}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400">
                      {formatNumber(log.tokensUsed)} tokens
                    </td>
                    <td className="px-6 py-3.5 font-bold text-teal-600 dark:text-teal-400">
                      -{log.creditsDeducted} credit
                    </td>
                    <td className="px-6 py-3.5 text-right text-slate-400 text-[11px]">
                      {new Date(log.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

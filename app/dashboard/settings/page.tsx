"use client";

import * as React from "react";
import {
  Settings,
  Users,
  CreditCard,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Mail,
  UserPlus,
  BarChart3,
  Bot,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RazorpayCheckoutButton } from "@/components/razorpay-checkout-button";

export default function SettingsPage() {
  const [members, setMembers] = React.useState<any[]>([]);
  const [sub, setSub] = React.useState<any>(null);
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState("EDITOR");
  const [isInviting, setIsInviting] = React.useState(false);

  const fetchSettingsData = async () => {
    try {
      const res = await fetch("/api/members");
      const json = await res.json();
      if (json.members) setMembers(json.members);
      if (json.subscription) setSub(json.subscription);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchSettingsData();
  }, []);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setIsInviting(true);
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const json = await res.json();
      if (json.member) {
        setMembers((prev) => [...prev, json.member]);
        setIsInviteOpen(false);
        setInviteEmail("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsInviting(false);
    }
  };

  const currentTier = sub?.plan || "PRO";

  const plans = [
    {
      key: "STARTER",
      name: "Starter",
      price: "₹1,999",
      amountINR: 1999,
      period: "/month",
      generations: "200 AI Generations",
      features: ["All Content Studio Tools", "Basic SEO Audit", "1 Workspace Member", "Email Support"],
      isCurrent: currentTier === "STARTER",
    },
    {
      key: "PRO",
      name: "Professional",
      price: "₹4,999",
      amountINR: 4999,
      period: "/month",
      generations: "1,000 AI Generations",
      features: [
        "Everything in Starter",
        "Multi-Agent AI Assistant",
        "Competitor Intelligence & Battlecards",
        "Full Content SEO Optimizer (0-100)",
        "30-Day Auto Content Calendar",
        "5 Team Members",
      ],
      isCurrent: currentTier === "PRO",
    },
    {
      key: "BUSINESS",
      name: "Business / Scale",
      price: "₹14,999",
      amountINR: 14999,
      period: "/month",
      generations: "5,000 AI Generations",
      features: [
        "Everything in Pro",
        "Unlimited Workspaces & Brands",
        "Custom Automated Workflows",
        "AI Executive Reports Export",
        "Dedicated Growth Strategist",
        "Unlimited Team Members",
      ],
      isCurrent: currentTier === "ENTERPRISE",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-1 border border-teal-200 dark:border-teal-800">
            <Settings className="h-3 w-3" />
            <span>Workspace Control</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Workspace Settings & Subscription Tiers
          </h1>
          <p className="text-xs text-slate-500">
            Manage team access permissions, AI monthly generation credits, and plan upgrades.
          </p>
        </div>
      </div>

      <Tabs defaultValue="team" className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md h-11">
          <TabsTrigger value="team" className="text-xs gap-1.5">
            <Users className="h-3.5 w-3.5" /> Team & Roles
          </TabsTrigger>
          <TabsTrigger value="billing" className="text-xs gap-1.5">
            <CreditCard className="h-3.5 w-3.5" /> Plan & Billing
          </TabsTrigger>
          <TabsTrigger value="usage" className="text-xs gap-1.5">
            <Bot className="h-3.5 w-3.5" /> AI Usage Tracker
          </TabsTrigger>
        </TabsList>

        {/* 1. TEAM & ROLES TAB */}
        <TabsContent value="team" className="space-y-6">
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <CardTitle className="text-sm font-bold">Workspace Team Members</CardTitle>
                <CardDescription className="text-xs">Role-based access control (RBAC)</CardDescription>
              </div>
              <Button
                onClick={() => setIsInviteOpen(true)}
                size="sm"
                className="h-8 text-xs gap-1.5 bg-teal-700 hover:bg-teal-800"
              >
                <UserPlus className="h-3.5 w-3.5" /> Invite Member
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {members.map((m) => (
                  <div key={m.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-bold flex items-center justify-center text-xs">
                        {m.user?.name ? m.user.name.slice(0, 2).toUpperCase() : "OM"}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {m.user?.name || "Team Member"}
                        </div>
                        <div className="text-[11px] text-slate-500">{m.user?.email}</div>
                      </div>
                    </div>

                    <Badge
                      variant={
                        m.role === "OWNER"
                          ? "default"
                          : m.role === "ADMIN"
                          ? "purple"
                          : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {m.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. PLAN & BILLING TAB */}
        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, idx) => (
              <Card
                key={idx}
                className={`shadow-sm flex flex-col justify-between transition-all ${
                  plan.isCurrent
                    ? "border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/20 dark:bg-teal-950/20"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold">{plan.name}</CardTitle>
                    {plan.isCurrent && (
                      <Badge variant="success" className="text-[10px]">Current Plan</Badge>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{plan.price}</span>
                    <span className="text-xs text-slate-500">{plan.period}</span>
                  </div>
                  <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 mt-1">
                    {plan.generations}
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-0 space-y-4 text-xs">
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                    {plan.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <RazorpayCheckoutButton
                      planKey={plan.key as any}
                      planName={plan.name}
                      amountINR={plan.amountINR}
                      isCurrent={plan.isCurrent}
                      onSuccess={() => fetchSettingsData()}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 3. AI USAGE TRACKER TAB */}
        <TabsContent value="usage" className="space-y-6">
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold">Monthly AI Token & Quota Metrics</CardTitle>
              <CardDescription className="text-xs">Live server-side generation consumption</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {sub?.generationsUsed || 148} / {sub?.monthlyGenerationsLimit || 1000}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Generations Used This Month</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-2xl font-bold text-teal-700 dark:text-teal-400 font-mono">
                    {Math.max(0, (sub?.monthlyGenerationsLimit || 1000) - (sub?.generationsUsed || 148))}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Remaining AI Credits</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-2xl font-bold text-emerald-600 font-mono">
                    $0.045
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Est. Computed Token Cost</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Monthly Quota Consumption</span>
                  <span>{Math.round(((sub?.generationsUsed || 148) / (sub?.monthlyGenerationsLimit || 1000)) * 100)}%</span>
                </div>
                <Progress
                  value={Math.round(((sub?.generationsUsed || 148) / (sub?.monthlyGenerationsLimit || 1000)) * 100)}
                  className="h-2.5"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Member Dialog Modal */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-teal-600" />
              Invite Team Member
            </DialogTitle>
            <DialogDescription className="text-xs">
              Add collaborators to this workspace with specific role permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Teammate Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
              >
                <option value="ADMIN">Admin (Full Control)</option>
                <option value="EDITOR">Editor (Create & Edit Content)</option>
                <option value="ANALYST">Analyst (View Analytics & Reports)</option>
                <option value="VIEWER">Viewer (Read-Only)</option>
              </select>
            </div>

            <Button
              onClick={handleInvite}
              disabled={isInviting || !inviteEmail}
              className="w-full h-10 text-xs font-bold gap-2 bg-teal-700 hover:bg-teal-800"
            >
              <UserPlus className="h-4 w-4" />
              {isInviting ? "Sending Invitation..." : "Send Invitation"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

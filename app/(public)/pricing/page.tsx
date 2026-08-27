import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "₹1,999",
      period: "/month",
      desc: "For solo entrepreneurs, creators, and early-stage Indian startups.",
      generations: "200 AI Generations / mo",
      features: [
        "Full Content Studio (Blog, Social, Ads, Email)",
        "Basic Technical SEO Site Audit",
        "Visual Content Calendar (1 Month)",
        "1 Workspace & Brand Kit",
        "Email Support",
      ],
      isPopular: false,
    },
    {
      name: "Professional",
      price: "₹4,999",
      period: "/month",
      desc: "For high-growth brands, D2C ventures, and performance agencies.",
      generations: "1,000 AI Generations / mo",
      features: [
        "Everything in Starter",
        "Agentic AI Marketing Assistant",
        "Content SEO Optimizer (Live 0-100 score + AI rewrite)",
        "Competitor Intelligence & Battlecards",
        "30-Day Automated Content Calendar",
        "Full Attribution & Channel ROI Analytics (₹ INR)",
        "Up to 5 Team Collaborators",
      ],
      isPopular: true,
    },
    {
      name: "Business / Enterprise",
      price: "₹14,999",
      period: "/month",
      desc: "For scaling marketing departments and digital agencies across India.",
      generations: "5,000 AI Generations / mo",
      features: [
        "Everything in Pro",
        "Unlimited Workspaces & Brands",
        "Event-Driven Automations Engine",
        "AI Executive Reports Export (PDF & JSON)",
        "Custom API Rate Limits & Webhooks",
        "Dedicated Growth Account Manager",
        "Unlimited Team Members & RBAC Roles",
      ],
      isPopular: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="secondary" className="text-xs font-semibold">
          Transparent Indian & Global Pricing (₹ INR)
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Simple Plans for adAIPROMORA
        </h1>
        <p className="text-sm text-slate-500">
          Start your 14-day free trial on any plan. Cancel anytime with no setup fees. Developed by Satkuri Kailash.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <Card
            key={idx}
            className={`p-8 shadow-sm flex flex-col justify-between space-y-6 ${
              plan.isPopular
                ? "border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/20 dark:bg-teal-950/20 shadow-xl"
                : "border-slate-200 dark:border-slate-800"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{plan.name}</h3>
                {plan.isPopular && <Badge variant="success" className="text-[10px]">Most Popular</Badge>}
              </div>
              <div className="text-4xl font-black text-slate-900 dark:text-slate-100">
                {plan.price}<span className="text-xs text-slate-500 font-normal">{plan.period}</span>
              </div>
              <p className="text-xs text-slate-500">{plan.desc}</p>
              <div className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                ⚡ {plan.generations}
              </div>

              <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4 text-xs">
                {plan.features.map((feat, fidx) => (
                  <div key={fidx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/register">
              <Button
                variant={plan.isPopular ? "gradient" : "outline"}
                className="w-full text-xs font-bold shadow-md"
              >
                Start 14-Day Free Trial
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

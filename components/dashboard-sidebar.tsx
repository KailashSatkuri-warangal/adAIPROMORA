"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  FileText,
  Calendar,
  Share2,
  Search,
  Sparkles,
  Target,
  Mail,
  BarChart3,
  FileCheck2,
  Palette,
  Zap,
  Globe,
  Settings,
  Flame,
  Layers,
  ChevronRight,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  isAi?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function DashboardSidebar({
  generationsUsed = 148,
  generationsLimit = 1000,
  brandName = "VedaGlow Organics India",
  workspaceName = "AIPROMORA Labs India",
}: {
  generationsUsed?: number;
  generationsLimit?: number;
  brandName?: string;
  workspaceName?: string;
}) {
  const pathname = usePathname();
  const usagePercent = Math.min(100, Math.round((generationsUsed / generationsLimit) * 100));

  const sections: NavSection[] = [
    {
      title: "Core Studio",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "AI Assistant", href: "/dashboard/assistant", icon: Bot, isAi: true, badge: "Agentic" },
        { title: "Content Studio", href: "/dashboard/content", icon: FileText, isAi: true },
      ],
    },
    {
      title: "Operations & Ads",
      items: [
        { title: "Campaigns", href: "/dashboard/campaigns", icon: Target },
        { title: "Content Calendar", href: "/dashboard/calendar", icon: Calendar, badge: "30D AI" },
        { title: "Social Media", href: "/dashboard/social", icon: Share2 },
        { title: "Email Marketing", href: "/dashboard/email", icon: Mail },
        { title: "AI Ads Manager", href: "/dashboard/ads", icon: Flame, isAi: true },
      ],
    },
    {
      title: "SEO & Intelligence",
      items: [
        { title: "SEO Intelligence", href: "/dashboard/seo", icon: Search },
        { title: "Content Optimizer", href: "/dashboard/seo/optimizer", icon: Zap, badge: "0-100" },
        { title: "Competitor Analysis", href: "/dashboard/competitors", icon: Globe },
        { title: "Landing Page Audit", href: "/dashboard/landing-page", icon: Sparkles, isAi: true },
      ],
    },
    {
      title: "Analytics & Scale",
      items: [
        { title: "Analytics Hub", href: "/dashboard/analytics", icon: BarChart3 },
        { title: "AI Reports", href: "/dashboard/reports", icon: FileCheck2, isAi: true },
        { title: "Billing & Credits", href: "/dashboard/transactions", icon: TrendingUp, badge: "₹ Live" },
        { title: "Brand Kit", href: "/dashboard/brand", icon: Palette },
        { title: "Automations", href: "/dashboard/automation", icon: Cpu, badge: "Rules" },
        { title: "Integrations", href: "/dashboard/integrations", icon: Layers },
        { title: "Settings & Team", href: "/dashboard/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 transition-all duration-200">
      {/* Brand & Workspace Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              ad<span className="text-teal-600 dark:text-teal-400">AIPROMORA</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500 truncate max-w-[120px]">
              {workspaceName}
            </span>
          </div>
        </Link>
        <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
          PRO
        </span>
      </div>

      {/* Navigation Links Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {section.title}
            </div>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all",
                      isActive
                        ? "bg-teal-600 text-white shadow-sm dark:bg-teal-600 dark:text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-transform group-hover:scale-110",
                          isActive
                            ? "text-white"
                            : item.isAi
                            ? "text-teal-600 dark:text-teal-400"
                            : "text-slate-500 dark:text-slate-400"
                        )}
                      />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* AI Usage & Brand Kit Widget */}
      <div className="border-t border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
            <Bot className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            AI Credits
          </span>
          <span className="font-mono text-[11px] text-slate-500">
            {generationsUsed} / {generationsLimit}
          </span>
        </div>
        <Progress value={usagePercent} className="h-1.5" />
        <div className="mt-2.5 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 truncate max-w-[140px]">
            Brand: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{brandName}</strong>
          </span>
          <Link
            href="/dashboard/settings"
            className="text-teal-600 hover:text-teal-700 dark:text-teal-400 font-medium"
          >
            Upgrade
          </Link>
        </div>
      </div>
    </aside>
  );
}

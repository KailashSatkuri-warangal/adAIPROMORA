"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  FileText,
  Search,
  Calendar,
  Share2,
  BarChart3,
  Target,
  Mail,
  Palette,
  Bot,
  Zap,
  Globe,
  Settings,
  ArrowRight,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const navItems = [
    {
      title: "Ask AI Assistant",
      desc: "Open conversational strategy assistant",
      icon: Bot,
      category: "AI Tools",
      action: () => router.push("/dashboard/assistant"),
    },
    {
      title: "Generate Blog Article",
      desc: "Write SEO pillar article with meta tags & FAQ",
      icon: FileText,
      category: "AI Tools",
      action: () => router.push("/dashboard/content?tab=blog"),
    },
    {
      title: "Create Multi-Platform Social Posts",
      desc: "Generate for Instagram, LinkedIn, X, and Threads",
      icon: Share2,
      category: "AI Tools",
      action: () => router.push("/dashboard/content?tab=social"),
    },
    {
      title: "Generate High-ROI Ad Copy",
      desc: "Google Ads & Meta Ads copy variations",
      icon: Target,
      category: "AI Tools",
      action: () => router.push("/dashboard/content?tab=ads"),
    },
    {
      title: "Content SEO Optimizer (Score 0-100)",
      desc: "Live keyword density, readability & 1-click AI rewrite",
      icon: Zap,
      category: "SEO & Growth",
      action: () => router.push("/dashboard/seo/optimizer"),
    },
    {
      title: "Website SEO Audit & Keyword Explorer",
      desc: "Technical checks, search volume & difficulty",
      icon: Search,
      category: "SEO & Growth",
      action: () => router.push("/dashboard/seo"),
    },
    {
      title: "Competitor Intelligence & Battlecards",
      desc: "SWOT matrix and outperforming playbooks",
      icon: Globe,
      category: "SEO & Growth",
      action: () => router.push("/dashboard/competitors"),
    },
    {
      title: "AI Visual Content Calendar",
      desc: "Month/Week view + 30-Day auto calendar generator",
      icon: Calendar,
      category: "Operations",
      action: () => router.push("/dashboard/calendar"),
    },
    {
      title: "Multi-Channel Campaign Manager",
      desc: "Build campaigns and generate AI blueprints",
      icon: Target,
      category: "Operations",
      action: () => router.push("/dashboard/campaigns"),
    },
    {
      title: "Email Marketing & Sequences",
      desc: "Contact lists, segmentation, and newsletters",
      icon: Mail,
      category: "Operations",
      action: () => router.push("/dashboard/email"),
    },
    {
      title: "Landing Page Structure Analyzer",
      desc: "Conversion score & wireframe recommendations",
      icon: Sparkles,
      category: "Operations",
      action: () => router.push("/dashboard/landing-page"),
    },
    {
      title: "Analytics & AI Executive Reports",
      desc: "Funnel metrics, attribution, and exportable reports",
      icon: BarChart3,
      category: "Reporting",
      action: () => router.push("/dashboard/analytics"),
    },
    {
      title: "Live Billing, Credits & Invoices",
      desc: "Razorpay transactions, credit balance, and PDF receipts",
      icon: BarChart3,
      category: "Reporting",
      action: () => router.push("/dashboard/transactions"),
    },
    {
      title: "Brand Kit & Guidelines",
      desc: "Logos, colors, voice, tone, and personas",
      icon: Palette,
      category: "Settings",
      action: () => router.push("/dashboard/brand"),
    },
    {
      title: "Workspace & Team Settings",
      desc: "RBAC roles, integrations, and AI token limits",
      icon: Settings,
      category: "Settings",
      action: () => router.push("/dashboard/settings"),
    },
  ];

  const filteredItems = navItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-slate-700 sm:w-64"
      >
        <Search className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
        <span className="flex-1 text-left">Search or ask AI...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-950 sm:flex">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 max-w-2xl">
          <div className="flex items-center border-b border-slate-200 px-4 dark:border-slate-800">
            <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search tools (e.g. 'blog', 'SEO', 'campaign', 'calendar')..."
              className="flex h-13 w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400 dark:text-slate-100"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto p-2">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">No direct tools found matching "{query}".</p>
                <button
                  onClick={() =>
                    runCommand(() =>
                      router.push(
                        `/dashboard/assistant?q=${encodeURIComponent(query)}`
                      )
                    )
                  }
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-700"
                >
                  <Bot className="h-3.5 w-3.5" />
                  Ask AI Assistant "{query}"
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => runCommand(item.action)}
                      className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-800/70"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400 group-hover:scale-105 transition-transform">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {item.category}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/80 px-4 py-2 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-950/80">
            <span>
              Tip: Press <kbd className="rounded border px-1 font-mono">ESC</kbd> to close
            </span>
            <span className="flex items-center gap-1 font-medium text-teal-700 dark:text-teal-400">
              <Sparkles className="h-3 w-3" /> adAIPROMORA AI Router
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

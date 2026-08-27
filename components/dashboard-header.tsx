"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Bot,
  ChevronDown,
  Sparkles,
  Building2,
  LogOut,
  User as UserIcon,
  Shield,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Plus,
} from "lucide-react";
import { CommandPalette } from "@/components/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string;
    image?: string | null;
    role?: string;
  };
  workspaceName?: string;
  brandName?: string;
  generationsRemaining?: number;
}

export function DashboardHeader({
  user = { name: "Satkuri Kailash", email: "kailash@aipromora.in", role: "OWNER" },
  workspaceName = "AIPROMORA Labs India",
  brandName = "VedaGlow Organics India",
  generationsRemaining = 852,
}: HeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      {/* Left section: Workspace switcher & Active Brand */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              <Building2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>{workspaceName}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <div className="px-2 py-1.5 text-xs font-medium text-slate-400">
              Workspaces
            </div>
            <DropdownMenuItem className="flex items-center justify-between font-medium">
              <span>{workspaceName}</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/onboarding")}
              className="text-teal-600 dark:text-teal-400"
            >
              <Plus className="mr-2 h-3.5 w-3.5" />
              Create New Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden items-center gap-1.5 rounded-lg bg-teal-50/70 px-2.5 py-1 text-xs text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 md:flex border border-teal-200/50 dark:border-teal-800/40">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
          <span>Brand: <strong className="font-semibold">{brandName}</strong></span>
        </div>
      </div>

      {/* Center / Right section: Command palette, Ask AI CTA, Notifications, Profile */}
      <div className="flex items-center gap-3">
        <CommandPalette />

        <Button
          onClick={() => router.push("/dashboard/assistant")}
          variant="gradient"
          size="sm"
          className="hidden sm:inline-flex gap-1.5 shadow-sm text-xs font-semibold"
        >
          <Bot className="h-3.5 w-3.5" />
          <span>Ask AI</span>
        </Button>

        <div className="hidden lg:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs dark:border-slate-800 dark:bg-slate-900">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
            {generationsRemaining}
          </span>
          <span className="text-[10px] text-slate-400">credits</span>
        </div>

        <ThemeToggle />

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-600 ring-2 ring-white dark:ring-slate-950" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-2 dark:border-slate-800">
              <span className="text-xs font-semibold">Notifications</span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400">Mark all as read</span>
            </div>
            <div className="space-y-1.5 pt-2 text-xs">
              <div className="rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  🎉 Spring Campaign ROAS Hit 4.96x
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Meta ads conversion spike generated 540 purchases in 14 days.
                </div>
              </div>
              <div className="rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  📈 Page #1 Organic Ranking Detected
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  "skin barrier repair serum" moved up +4 positions to rank #2.
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border border-slate-200 p-0.5 transition-all hover:ring-2 hover:ring-teal-500 dark:border-slate-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-xs font-bold text-white shadow-inner">
                {user.name ? user.name.slice(0, 2).toUpperCase() : "OM"}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1.5">
            <div className="flex flex-col space-y-0.5 p-2">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {user.name || "Alex Morgan"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {user.email || "demo@omnimarket.ai"}
              </p>
              <div className="mt-1">
                <Badge variant="success" className="text-[9px] px-1.5 py-0">
                  {user.role || "OWNER"}
                </Badge>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/brand")}>
              <UserIcon className="mr-2 h-3.5 w-3.5" />
              <span>Brand Kit & Persona</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <CreditCard className="mr-2 h-3.5 w-3.5" />
              <span>Billing & Plan Tiers</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <Shield className="mr-2 h-3.5 w-3.5" />
              <span>Team & Permissions</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-600 focus:text-red-600 dark:text-red-400"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

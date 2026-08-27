import * as React from "react";
import Link from "next/link";
import { Sparkles, Bot, ArrowRight, Code2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 flex flex-col">
      {/* Top Banner for Region & Developer Credit */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white text-[11px] py-1.5 px-4 text-center border-b border-teal-800/40">
        <span className="font-semibold text-teal-300">🇮🇳 adAIPROMORA (India & Global Edition)</span>
        <span className="mx-2 opacity-60">•</span>
        <span className="text-slate-300">Architected & Developed by <strong className="text-white">Satkuri Kailash</strong></span>
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                ad<span className="text-teal-600 dark:text-teal-400">AIPROMORA</span>
              </span>
              <span className="text-[9px] text-slate-400 font-medium">India's AI Marketing OS</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Link href="/features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Features
            </Link>
            <Link href="/tools" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              AI Tools
            </Link>
            <Link href="/pricing" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Pricing (₹ INR)
            </Link>
            <Link href="/about" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Auth & CTA buttons */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs font-semibold">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="gradient"
                size="sm"
                className="text-xs font-bold gap-1.5 shadow-md"
              >
                <span>Start for Free</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                adAIPROMORA
              </span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              India's comprehensive all-in-one AI digital marketing operating platform for startups, agencies, creators, and high-growth brands worldwide.
            </p>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-teal-600" />
                Backend Architecture & System Development:
              </div>
              <p className="text-teal-700 dark:text-teal-300 font-semibold">
                Developed by Satkuri Kailash
              </p>
            </div>
            <div className="text-[11px] text-slate-400 pt-2">
              © {new Date().getFullYear()} adAIPROMORA Inc. (India). All rights reserved.
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
              AI Tools
            </div>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><Link href="/dashboard/content?tab=blog" className="hover:text-teal-600">SEO Blog Generator</Link></li>
              <li><Link href="/dashboard/content?tab=social" className="hover:text-teal-600">Social Posts Studio</Link></li>
              <li><Link href="/dashboard/seo/optimizer" className="hover:text-teal-600">Content SEO Optimizer</Link></li>
              <li><Link href="/dashboard/ads" className="hover:text-teal-600">Google & Meta Ads</Link></li>
              <li><Link href="/dashboard/calendar" className="hover:text-teal-600">30-Day Indian Calendar</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
              Platform
            </div>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><Link href="/features" className="hover:text-teal-600">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-teal-600">Plans (₹ INR)</Link></li>
              <li><Link href="/dashboard" className="hover:text-teal-600">Live Demo Workspace</Link></li>
              <li><Link href="/dashboard/integrations" className="hover:text-teal-600">Integrations</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
              Organization & Lead
            </div>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><Link href="/about" className="hover:text-teal-600">About Satkuri Kailash</Link></li>
              <li><Link href="/contact" className="hover:text-teal-600">India Contact & Sales</Link></li>
              <li><Link href="/login" className="hover:text-teal-600">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-teal-600">Register Free</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

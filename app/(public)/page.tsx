"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Bot,
  FileText,
  Search,
  Calendar,
  Share2,
  BarChart3,
  Target,
  Mail,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Globe,
  Star,
  Layers,
  ChevronDown,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const features = [
    {
      icon: Bot,
      title: "Agentic AI Marketing Assistant",
      desc: "Conversational growth strategist with persistent brand memory, generating 30-day blueprints, ad hooks, and lifecycle drips tailored for Indian & global markets.",
    },
    {
      icon: FileText,
      title: "Multi-Channel Content Studio",
      desc: "Generate long-form SEO blog pillars, platform-tailored social carousels, and high-converting product descriptions in seconds.",
    },
    {
      icon: Zap,
      title: "Content SEO Optimizer (0-100)",
      desc: "Real-time on-page grader with keyword density checks, semantic gap analysis, and 1-click AI content enhancement.",
    },
    {
      icon: Calendar,
      title: "30-Day Visual Content Calendar",
      desc: "Automated editorial calendar scheduling posts across Instagram, LinkedIn, X, Threads, and Newsletters.",
    },
    {
      icon: Globe,
      title: "Competitor Intelligence & Battlecards",
      desc: "Audit competitor positioning, analyze weaknesses, and generate actionable playbooks to win category market share in India and abroad.",
    },
    {
      icon: BarChart3,
      title: "Full-Funnel Attribution & Revenue (₹ INR)",
      desc: "Multi-touch ROI dashboards and automated AI executive reports exportable as PDF and JSON with INR revenue metrics.",
    },
  ];

  const workflowSteps = [
    { step: "01", title: "Brand Intelligence", desc: "Inject voice, persona, and USP into persistent AI memory." },
    { step: "02", title: "Strategy & SEO", desc: "Uncover high-intent keyword gaps and competitive angles." },
    { step: "03", title: "Content & Ads", desc: "Produce SEO blogs, social bundles, and ad copy in seconds." },
    { step: "04", title: "Schedule & Publish", desc: "Visual 30-day calendar with multi-channel queue." },
    { step: "05", title: "Analytics & Scale", desc: "Attribution telemetry, AI diagnostic reports, and repeat." },
  ];

  const faqs = [
    {
      q: "What is adAIPROMORA and who developed it?",
      a: "adAIPROMORA is an all-in-one AI digital marketing operating system designed and developed by Satkuri Kailash. It replaces 10+ disconnected marketing tools with a unified suite covering SEO, social, ad creative, email drips, calendar, and attribution analytics.",
    },
    {
      q: "How does adAIPROMORA cater to Indian businesses and global teams?",
      a: "adAIPROMORA is engineered for Indian and international companies, supporting Indian currency (INR ₹), local and global SEO search intent, localized social trends, and omnichannel ad formats across Meta, Google, and LinkedIn.",
    },
    {
      q: "Can I bring my own OpenAI or Google Gemini API keys?",
      a: "Yes! adAIPROMORA features a pluggable provider abstraction layer. You can seamlessly switch between Gemini, OpenAI, Claude, or our built-in Domain Intelligence Fallback Engine without lock-in.",
    },
    {
      q: "How does the Content SEO Optimizer work?",
      a: "The optimizer parses your draft in real-time, calculating a 0–100 SEO score based on keyword density, first-100-words placement, heading hierarchy, and semantic relevance. With 1 click, AI rewrites the draft to score 95+ while preserving your authentic voice.",
    },
    {
      q: "Is there a demo mode to test without setting up third-party credentials?",
      a: "Absolutely! adAIPROMORA includes a fully populated demo mode with pre-seeded campaigns, analytics snapshots, competitor battlecards, and editorial calendar drops.",
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 md:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-xs">
          <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span>adAIPROMORA — India's Premier AI Marketing Operating System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-tight">
          Your Entire Marketing Team,{" "}
          <span className="gradient-text">Powered by AI.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Consolidate AI content generation, SEO intelligence, competitor battlecards, social scheduling, ad creative, email marketing, and full-funnel attribution into one unified operating system.
        </p>

        {/* Developer Attribution Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-medium">
          <Code2 className="h-3.5 w-3.5 text-teal-600" />
          <span>Backend & AI Engine Architecture Developed by <strong>Satkuri Kailash</strong></span>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto h-13 px-8 text-sm font-bold gap-2 shadow-xl hover:scale-105 transition-transform"
            >
              <span>Start for Free (14-Day Trial)</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-13 px-8 text-sm font-semibold border-slate-300 dark:border-slate-700"
            >
              <Sparkles className="mr-2 h-4 w-4 text-teal-600" />
              Explore Live Demo Workspace
            </Button>
          </Link>
        </div>

        {/* Hero Dashboard Preview Card Mockup */}
        <div className="pt-10 max-w-6xl mx-auto">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-900 p-2 sm:p-3 shadow-2xl dark:border-slate-800">
            <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-4 sm:p-6 text-left space-y-6">
              {/* Mock Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">adAIPROMORA Studio — VedaGlow Organics India</div>
                    <div className="text-[10px] text-slate-400">Campaign: Festive Season 2026 Skin Barrier Launch (4.96x ROAS)</div>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px]">92/100 Marketing Score</Badge>
              </div>

              {/* Mock 3 Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="text-teal-400 font-bold flex items-center gap-1.5">
                    <Bot className="h-3.5 w-3.5" /> AI Strategy Recommendation
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Deploy 3-slide clinical redness reduction UGC carousels across Instagram & Meta. Projected revenue: <strong>₹7,45,000</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="text-blue-400 font-bold flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" /> SEO Pillar Guide
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    "Ayurvedic skin barrier repair serum" guide ranks #1 on Google India. On-page SEO score: <strong>96/100</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5" /> Full-Funnel Attribution
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    48,200 visitors generated 1,420 customer orders (₹42,80,000 revenue) at ₹420 CAC.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="secondary" className="text-xs font-semibold">
            Unified SaaS Modules
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Everything You Need to Scale Marketing Velocity
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
            Stop juggling 10 disconnected tools. One intelligent platform powers your entire strategy from creation to conversion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} className="shadow-sm border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-600 transition-all p-6 space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{feat.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. WORKFLOW LOOP DIAGRAM */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="space-y-2">
            <Badge variant="success" className="text-xs">Continuous Growth Loop</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              The adAIPROMORA Growth Operating Model
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs">
            {workflowSteps.map((wf, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-left shadow-xs">
                <div className="text-2xl font-black text-teal-600 dark:text-teal-400">{wf.step}</div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{wf.title}</div>
                <p className="text-slate-500 leading-relaxed text-[11px]">{wf.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRICING TIERS (₹ INR & Global) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="secondary" className="text-xs font-semibold">Predictable Pricing in INR (₹)</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Simple, Scalable Plans for Indian & Global Teams
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-sm border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="font-bold text-lg">Starter</div>
              <div className="text-3xl font-black">₹1,999<span className="text-xs text-slate-500 font-normal">/month</span></div>
              <p className="text-xs text-slate-500">Perfect for creators and early-stage founders in India.</p>
              <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> 200 AI generations / month</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> Blog & Social Post Studio</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> Basic SEO Audit</div>
              </div>
            </div>
            <Link href="/register">
              <Button variant="outline" className="w-full text-xs font-bold">Start Free Trial</Button>
            </Link>
          </Card>

          <Card className="shadow-xl border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/20 dark:bg-teal-950/20 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-bold text-lg">Professional</div>
                <Badge variant="success" className="text-[10px]">Most Popular in India</Badge>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100">₹4,999<span className="text-xs text-slate-500 font-normal">/month</span></div>
              <p className="text-xs text-slate-500">For high-growth startups, D2C brands, and agencies.</p>
              <div className="space-y-2 text-xs border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> 1,000 AI generations / month</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> Full SEO Content Optimizer (0-100)</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> 30-Day Auto Content Calendar</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> Competitor SWOT & Battlecards</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> 5 Team Members</div>
              </div>
            </div>
            <Link href="/register">
              <Button variant="gradient" className="w-full text-xs font-bold shadow-md">Get Started with Pro</Button>
            </Link>
          </Card>

          <Card className="shadow-sm border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="font-bold text-lg">Business / Enterprise</div>
              <div className="text-3xl font-black">₹14,999<span className="text-xs text-slate-500 font-normal">/month</span></div>
              <p className="text-xs text-slate-500">For scaling marketing departments and digital agencies.</p>
              <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> 5,000 AI generations / month</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> Unlimited Workspaces & Brands</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> Custom Event-Driven Automations</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> AI Executive Reports Export</div>
              </div>
            </div>
            <Link href="/contact">
              <Button variant="outline" className="w-full text-xs font-bold">Contact Sales</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* 5. TESTIMONIALS (Indian & Global founders) */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <div>
            <Badge variant="secondary" className="text-xs">Customer Case Studies</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">
              Trusted by High-Velocity Growth Teams Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-left">
            <Card className="p-6 space-y-3">
              <div className="flex text-amber-500"><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /></div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "adAIPROMORA transformed our D2C launch in Mumbai and Bengaluru. The 30-day content calendar and SEO optimizer helped us achieve 4.96x ROAS within 2 weeks."
              </p>
              <div className="font-bold text-slate-900 dark:text-slate-100">Rohit Sharma • Founder, VedaGlow Organics</div>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="flex text-amber-500"><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /></div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "The competitor battlecards gave us the exact paid ad hooks to target users switching away from legacy players. Developed with amazing precision by Satkuri Kailash."
              </p>
              <div className="font-bold text-slate-900 dark:text-slate-100">Ananya Verma • Growth Head, TechNext Hyderabad</div>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="flex text-amber-500"><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /></div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "We replaced 4 separate subscription tools. Having our Brand Kit injected directly into every AI generation saves our agency team 25+ hours a week."
              </p>
              <div className="font-bold text-slate-900 dark:text-slate-100">Kavita Reddy • Director, DigitalPulse Agency Delhi</div>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="secondary" className="text-xs">Got Questions?</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 pt-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex items-center justify-between w-full text-left font-bold text-sm text-slate-900 dark:text-slate-100"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {openFaq === idx && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2.5 animate-in fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 p-10 md:p-16 text-center text-white space-y-6 shadow-2xl border border-teal-800/40">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Supercharge Your Marketing with adAIPROMORA?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Join hundreds of Indian & global brands scaling organic reach, Paid Ads, and conversion velocity with AI.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button
                variant="gradient"
                size="lg"
                className="h-13 px-8 text-sm font-bold gap-2 shadow-lg"
              >
                <span>Start 14-Day Free Trial</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="h-13 px-8 text-sm font-semibold border-white/20 text-white hover:bg-white/10"
              >
                Explore Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

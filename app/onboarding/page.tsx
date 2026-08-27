"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Building,
  Palette,
  Target,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Rocket,
  Check,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Step 1: Business Info
  const [businessName, setBusinessName] = React.useState("VedaGlow Organics India");
  const [website, setWebsite] = React.useState("https://vedaglow.in");
  const [industry, setIndustry] = React.useState("Ayurvedic & Clean Skincare / D2C");
  const [businessType, setBusinessType] = React.useState("D2C & B2B Premium Retail");
  const [targetAudience, setTargetAudience] = React.useState("Eco-conscious urban Indian consumers & sensitive skin individuals");
  const [uniqueSellingProp, setUniqueSellingProp] = React.useState("100% cold-pressed Ayurvedic botanicals with clinically proven 78% redness reduction");
  const [description, setDescription] = React.useState("Ancient Ayurvedic formulation backed by modern cosmetic chemistry, engineered with zero synthetic fillers.");

  // Step 2: Brand Identity
  const [voice, setVoice] = React.useState("Inspiring, Authentic, Authoritative & Warm");
  const [tone, setTone] = React.useState("Educational, Welcoming & Transparent");
  const [targetPersona, setTargetPersona] = React.useState("Pooja (29), working professional in Bengaluru. Suffers from barrier sensitivity due to pollution and seeks clean beauty transparency.");
  const [primaryColor, setPrimaryColor] = React.useState("#0F766E");
  const [secondaryColor, setSecondaryColor] = React.useState("#D97706");
  const [accentColor, setAccentColor] = React.useState("#F43F5E");

  // Step 3: Marketing Goals
  const [selectedGoals, setSelectedGoals] = React.useState<string[]>([
    "Increase website traffic",
    "Generate leads",
    "Increase sales (₹ INR)",
    "Improve SEO across India",
  ]);

  const availableGoals = [
    "Increase website traffic",
    "Generate leads",
    "Increase sales (₹ INR)",
    "Grow Instagram & LinkedIn",
    "Improve SEO across India",
    "Increase brand awareness",
    "Email subscribers",
    "Improve conversion rate",
  ];

  const toggleGoal = (g: string) => {
    setSelectedGoals((prev) =>
      prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g]
    );
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          website,
          industry,
          businessType,
          targetAudience,
          uniqueSellingProp,
          description,
          voice,
          tone,
          targetPersona,
          goals: selectedGoals,
          colors: {
            primary: primaryColor,
            secondary: secondaryColor,
            accent: accentColor,
          },
        }),
      });

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white shadow-lg mb-2">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Welcome to ad<span className="text-teal-600 dark:text-teal-400">AIPROMORA</span>
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Let's configure your Indian business profile and brand voice so your AI marketing engine can generate high-converting campaigns.
        </p>

        {/* Step Indicator Progress Bar */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${step >= 1 ? "text-teal-600" : "text-slate-400"}`}>
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? "bg-teal-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>1</span>
            <span>Business</span>
          </div>
          <div className="h-0.5 w-8 bg-slate-200 dark:bg-slate-800" />
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${step >= 2 ? "text-teal-600" : "text-slate-400"}`}>
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? "bg-teal-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>2</span>
            <span>Brand Voice</span>
          </div>
          <div className="h-0.5 w-8 bg-slate-200 dark:border-slate-800" />
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${step >= 3 ? "text-teal-600" : "text-slate-400"}`}>
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? "bg-teal-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>3</span>
            <span>Growth Goals</span>
          </div>
        </div>
      </div>

      <Card className="sm:mx-auto sm:w-full sm:max-w-2xl shadow-xl border-slate-200 dark:border-slate-800">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: BUSINESS PROFILE */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in text-xs">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Building className="h-4 w-4 text-teal-600" /> Step 1: Business Profile
                </h2>
                <p className="text-slate-500 mt-0.5">Tell us about your company, Indian market website, and customer demographic.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Business Name</label>
                  <input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Website URL</label>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Industry</label>
                  <input
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Business Type</label>
                  <input
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Target Audience</label>
                <input
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Unique Selling Proposition (USP)</label>
                <textarea
                  value={uniqueSellingProp}
                  onChange={(e) => setUniqueSellingProp(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                />
              </div>

              <div className="flex justify-end pt-3">
                <Button onClick={() => setStep(2)} className="h-10 px-6 text-xs font-bold gap-2 bg-teal-700 hover:bg-teal-800">
                  Next: Brand Identity <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: BRAND IDENTITY */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in text-xs">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-amber-500" /> Step 2: Brand Voice & Colors
                </h2>
                <p className="text-slate-500 mt-0.5">Customize your brand tone and visual palette.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Brand Voice</label>
                  <input
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Tone of Voice</label>
                  <input
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Ideal Customer Persona</label>
                <textarea
                  value={targetPersona}
                  onChange={(e) => setTargetPersona(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                />
              </div>

              {/* Color Swatch Selectors */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Brand Palette Colors</label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-7 w-7 rounded cursor-pointer border-0"
                    />
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold">Primary</div>
                      <div className="font-mono text-[10px]">{primaryColor}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="h-7 w-7 rounded cursor-pointer border-0"
                    />
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold">Secondary</div>
                      <div className="font-mono text-[10px]">{secondaryColor}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="h-7 w-7 rounded cursor-pointer border-0"
                    />
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold">Accent</div>
                      <div className="font-mono text-[10px]">{accentColor}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <Button variant="outline" onClick={() => setStep(1)} className="h-10 text-xs">
                  <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="h-10 px-6 text-xs font-bold gap-2 bg-teal-700 hover:bg-teal-800">
                  Next: Growth Objectives <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: MARKETING GOALS */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in text-xs">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Target className="h-4 w-4 text-teal-600" /> Step 3: Marketing Objectives
                </h2>
                <p className="text-slate-500 mt-0.5">Select all goals you want your adAIPROMORA AI engine to prioritize.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {availableGoals.map((goal) => {
                  const isChecked = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? "border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold"
                          : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <span>{goal}</span>
                      {isChecked && <CheckCircle2 className="h-4 w-4 text-teal-600" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="h-10 text-xs">
                  <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back
                </Button>
                <Button
                  onClick={handleFinish}
                  disabled={isSubmitting || selectedGoals.length === 0}
                  className="h-11 px-8 text-xs font-bold gap-2 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 text-white shadow-lg"
                >
                  <Rocket className="h-4 w-4" />
                  {isSubmitting ? "Generating AI Brand Blueprint..." : "Launch Growth Dashboard"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

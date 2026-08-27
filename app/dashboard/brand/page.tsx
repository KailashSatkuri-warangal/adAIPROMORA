"use client";

import * as React from "react";
import {
  Palette,
  Sparkles,
  Save,
  CheckCircle2,
  Building,
  UserCheck,
  Shield,
  Layers,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BrandKitPage() {
  const [brand, setBrand] = React.useState<any>({
    name: "VedaGlow Organics India",
    website: "https://vedaglow.in",
    industry: "Ayurvedic & Clean Skincare / D2C Beauty",
    businessType: "D2C & B2B Premium Retail",
    tagline: "Pure Ayurvedic Botanicals. Clinically Proven Radiance.",
    description: "Cold-pressed Ayurvedic botanicals and barrier repair formulations engineered for sensitive Indian skin with zero synthetic toxins.",
    targetAudience: "Health-conscious millennial and Gen-Z consumers (ages 22-45) across Indian metropolitan cities.",
    targetPersona: "Pooja (29), working professional in Bengaluru. Experiences redness from city pollution and values clean Ayurvedic ingredient transparency.",
    uniqueSellingProp: "100% cold-pressed Ayurvedic botanical barrier restoration with independent clinical trials demonstrating 78% redness reduction in 14 days.",
    voice: "Inspiring, Authoritative, Empathetic, and Scientifically Rigorous",
    tone: "Warm, Empowering, Educational, and Transparent",
    guidelines: "Always highlight clinical efficacy while celebrating Ayurvedic heritage. Include clear CTAs to free skin analysis quiz.",
    colorsJson: JSON.stringify({
      primary: "#0F766E",
      secondary: "#D97706",
      accent: "#F43F5E",
      neutral: "#1E293B",
    }),
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/brand")
      .then((r) => r.json())
      .then((d) => {
        if (d.brand) setBrand(d.brand);
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brand),
      });
      const json = await res.json();
      if (json.brand) {
        setBrand(json.brand);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const colors = typeof brand.colorsJson === "string" ? JSON.parse(brand.colorsJson || "{}") : brand.colorsJson || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-1 border border-teal-200 dark:border-teal-800">
            <Palette className="h-3 w-3" />
            <span>Brand Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Brand Kit & AI Identity Memory
          </h1>
          <p className="text-xs text-slate-500">
            Every AI generation (blog, social, email, ad copy) automatically draws from this persistent brand profile.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="h-10 px-5 text-xs font-bold gap-2 bg-teal-700 hover:bg-teal-800 shadow-md"
        >
          {saveSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{saveSuccess ? "Changes Saved!" : "Save Brand Kit"}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core Identity Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Building className="h-4 w-4 text-teal-600" /> Business Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Brand Name</label>
                  <input
                    value={brand.name || ""}
                    onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Website URL</label>
                  <input
                    value={brand.website || ""}
                    onChange={(e) => setBrand({ ...brand, website: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Industry</label>
                  <input
                    value={brand.industry || ""}
                    onChange={(e) => setBrand({ ...brand, industry: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Business Model</label>
                  <input
                    value={brand.businessType || ""}
                    onChange={(e) => setBrand({ ...brand, businessType: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Brand Tagline</label>
                <input
                  value={brand.tagline || ""}
                  onChange={(e) => setBrand({ ...brand, tagline: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Company Overview</label>
                <textarea
                  value={brand.description || ""}
                  onChange={(e) => setBrand({ ...brand, description: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Unique Selling Proposition (USP)
                </label>
                <textarea
                  value={brand.uniqueSellingProp || ""}
                  onChange={(e) => setBrand({ ...brand, uniqueSellingProp: e.target.value })}
                  rows={2}
                  className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voice, Persona & Color Swatches Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand Voice & Tone */}
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> Voice & Persona
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Brand Voice</label>
                <input
                  value={brand.voice || ""}
                  onChange={(e) => setBrand({ ...brand, voice: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Tone</label>
                <input
                  value={brand.tone || ""}
                  onChange={(e) => setBrand({ ...brand, tone: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Target Persona</label>
                <textarea
                  value={brand.targetPersona || ""}
                  onChange={(e) => setBrand({ ...brand, targetPersona: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Visual Brand Colors */}
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Palette className="h-4 w-4 text-teal-600" /> Visual Color Swatches
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <div
                    className="h-12 w-full rounded-xl shadow-xs border border-slate-200 dark:border-slate-800"
                    style={{ backgroundColor: colors.primary || "#0F766E" }}
                  />
                  <div className="font-mono text-[10px] text-slate-500 mt-1.5">
                    {colors.primary || "#0F766E"}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Primary</div>
                </div>

                <div>
                  <div
                    className="h-12 w-full rounded-xl shadow-xs border border-slate-200 dark:border-slate-800"
                    style={{ backgroundColor: colors.secondary || "#D97706" }}
                  />
                  <div className="font-mono text-[10px] text-slate-500 mt-1.5">
                    {colors.secondary || "#D97706"}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Secondary</div>
                </div>

                <div>
                  <div
                    className="h-12 w-full rounded-xl shadow-xs border border-slate-200 dark:border-slate-800"
                    style={{ backgroundColor: colors.accent || "#F43F5E" }}
                  />
                  <div className="font-mono text-[10px] text-slate-500 mt-1.5">
                    {colors.accent || "#F43F5E"}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Accent</div>
                </div>

                <div>
                  <div
                    className="h-12 w-full rounded-xl shadow-xs border border-slate-200 dark:border-slate-800"
                    style={{ backgroundColor: colors.neutral || "#1E293B" }}
                  />
                  <div className="font-mono text-[10px] text-slate-500 mt-1.5">
                    {colors.neutral || "#1E293B"}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Neutral</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

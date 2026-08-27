"use client";

import * as React from "react";
import {
  Flame,
  Sparkles,
  Copy,
  Check,
  Target,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function AdsManagerPage() {
  const [productName, setProductName] = React.useState("");
  const [offer, setOffer] = React.useState("");
  const [audience, setAudience] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [adResult, setAdResult] = React.useState<any>(null);

  const handleGenerateAds = async () => {
    if (!productName.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ads",
          payload: {
            productOrService: productName,
            offerDetails: offer,
            targetAudience: audience,
          },
        }),
      });
      const json = await res.json();
      if (json.data) {
        setAdResult(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 mb-1 border border-rose-200 dark:border-rose-800">
            <Flame className="h-3 w-3" />
            <span>AI Advertisement Studio</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            High-Converting Google & Meta Ads Suite
          </h1>
          <p className="text-xs text-slate-500">
            Generate compliant multi-variation ad hooks, responsive search headlines, and negative keyword exclusions.
          </p>
        </div>
      </div>

      {/* Two Column Layout: Brief Form vs Generated Ad Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Brief Column */}
        <Card className="lg:col-span-5 shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm font-bold">Campaign Creative Brief</CardTitle>
            <CardDescription className="text-xs">Define the offer and target customer profile</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Product / Service</label>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product or service name..."
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Offer / Promotion Angle</label>
              <textarea
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                rows={3}
                placeholder="e.g. 15% launch discount with code VEDA15 + Free Pan-India Shipping..."
                className="w-full p-3.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Target Audience Profile</label>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Founders, small business owners, D2C shoppers..."
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs"
              />
            </div>

            <Button
              onClick={handleGenerateAds}
              disabled={isLoading || !productName.trim()}
              variant="gradient"
              className="w-full h-11 text-xs font-bold gap-2 shadow-md"
            >
              <Sparkles className="h-4 w-4" />
              {isLoading ? "Generating 5-Variation Creative Suite..." : "Generate 5 Ad Variations"}
            </Button>
          </CardContent>
        </Card>

        {/* Ad Suite Column */}
        <div className="lg:col-span-7 space-y-6">
          {!adResult ? (
            <div className="h-80 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
              <Flame className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Ad Creatives Generated Yet</div>
                <p className="text-xs text-slate-500 max-w-sm">Enter your product name and offer details on the left, then click "Generate 5 Ad Variations".</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="meta" className="space-y-4 animate-in fade-in">
              <TabsList className="grid grid-cols-2 max-w-xs h-10">
                <TabsTrigger value="meta" className="text-xs">Meta (FB/IG) Ads</TabsTrigger>
                <TabsTrigger value="google" className="text-xs">Google Search Ads</TabsTrigger>
              </TabsList>

              {/* Meta Ads View */}
              <TabsContent value="meta" className="space-y-4">
                {adResult?.metaAds?.primaryTextVariations?.map((text: string, idx: number) => (
                  <Card key={idx} className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
                      <Badge variant="purple" className="text-[10px]">Hook Variation {idx + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(text, `meta-${idx}`)}
                        className="h-7 text-xs gap-1"
                      >
                        {copiedKey === `meta-${idx}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        Copy
                      </Button>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2 text-xs">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{text}</p>
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-[11px]">
                        <span className="font-semibold text-slate-500">CTA: {adResult.metaAds.callToAction}</span>
                        <span className="text-teal-600 font-medium">Character Count: {text.length}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Google Ads View */}
              <TabsContent value="google" className="space-y-4">
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-sm font-bold">Responsive Search Ad Headlines (Under 30 Chars)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2 text-xs">
                    {adResult?.googleAds?.headlines?.map((h: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="font-medium text-slate-900 dark:text-slate-100">{h}</span>
                        <span className="text-[11px] font-mono text-slate-400">{h.length}/30</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-sm font-bold">Ad Descriptions (Under 90 Chars)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2 text-xs">
                    {adResult?.googleAds?.descriptions?.map((d: string, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 space-y-1 border border-slate-200 dark:border-slate-800">
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{d}</p>
                        <div className="text-[10px] text-right font-mono text-slate-400">{d.length}/90</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}

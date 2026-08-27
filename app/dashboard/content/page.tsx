"use client";

import * as React from "react";
import {
  FileText,
  Share2,
  Flame,
  Mail,
  ShoppingBag,
  Sparkles,
  Copy,
  Check,
  Download,
  Save,
  Calendar,
  Layers,
  CheckCircle2,
  ChevronRight,
  Eye,
  Edit3,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FormattedMarkdown } from "@/components/ui/formatted-markdown";
import { trackMarketingEvent } from "@/lib/firebase";

export default function ContentStudioPage() {
  const [activeTab, setActiveTab] = React.useState("blog");
  const [blogViewMode, setBlogViewMode] = React.useState<"edit" | "preview">("preview");
  const [isLoading, setIsLoading] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Form states (Clean empty inputs for user entry)
  const [blogTopic, setBlogTopic] = React.useState("");
  const [blogKeyword, setBlogKeyword] = React.useState("");
  const [blogLength, setBlogLength] = React.useState<"short" | "medium" | "long">("medium");

  const [socialTopic, setSocialTopic] = React.useState("");
  const [socialTone, setSocialTone] = React.useState("");

  const [adProduct, setAdProduct] = React.useState("");
  const [adOffer, setAdOffer] = React.useState("");

  const [emailType, setEmailType] = React.useState("welcome");
  const [emailGoal, setEmailGoal] = React.useState("");

  // Output states (Null by default, populated dynamically on user generation)
  const [generatedBlog, setGeneratedBlog] = React.useState<any>(null);
  const [editableBody, setEditableBody] = React.useState("");
  const [generatedSocial, setGeneratedSocial] = React.useState<any>(null);
  const [generatedAds, setGeneratedAds] = React.useState<any>(null);
  const [generatedEmail, setGeneratedEmail] = React.useState<any>(null);

  const handleGenerate = async (type: string) => {
    setIsLoading(true);
    setSavedSuccess(false);

    let payload: any = {};
    if (type === "blog") {
      payload = { topic: blogTopic, keyword: blogKeyword, length: blogLength };
    } else if (type === "social") {
      payload = { topic: socialTopic, tone: socialTone || "Engaging & High-Converting" };
    } else if (type === "ads") {
      payload = { productOrService: adProduct, offerDetails: adOffer };
    } else if (type === "email") {
      payload = { campaignType: emailType, subjectGoal: emailGoal };
    }

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload }),
      });

      const json = await res.json();
      if (json.data) {
        if (type === "blog") {
          setGeneratedBlog(json.data);
          setEditableBody(json.data.fullArticle || "");
          setBlogViewMode("preview");
        } else if (type === "social") {
          setGeneratedSocial(json.data);
        } else if (type === "ads") {
          setGeneratedAds(json.data);
        } else if (type === "email") {
          setGeneratedEmail(json.data);
          setEditableBody(json.data.body || "");
        }
        trackMarketingEvent("generate_content", { type });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveDraft = async (title: string, type: string, body: string) => {
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Untitled Marketing Draft",
          type,
          body,
          primaryKeyword: blogKeyword,
          seoScore: 94,
        }),
      });
      setSavedSuccess(true);
      trackMarketingEvent("save_content_draft", { type, title });
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-1 border border-teal-200 dark:border-teal-800">
            <Sparkles className="h-3 w-3" />
            <span>AI Content Studio</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Multi-Channel Content Generation Workspace
          </h1>
          <p className="text-xs text-slate-500">
            Produce high-converting blog pillars, platform-tailored social posts, compliant ad copy, and email sequences with brand voice injection.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            Saved to Content Library
          </div>
        )}
      </div>

      {/* Main Tabs Workspace */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 max-w-2xl h-11">
          <TabsTrigger value="blog" className="text-xs gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Blog Article
          </TabsTrigger>
          <TabsTrigger value="social" className="text-xs gap-1.5">
            <Share2 className="h-3.5 w-3.5" /> Social Media
          </TabsTrigger>
          <TabsTrigger value="ads" className="text-xs gap-1.5">
            <Flame className="h-3.5 w-3.5" /> Ad Copy
          </TabsTrigger>
          <TabsTrigger value="email" className="text-xs gap-1.5">
            <Mail className="h-3.5 w-3.5" /> Email Sequence
          </TabsTrigger>
        </TabsList>

        {/* 1. BLOG ARTICLE GENERATOR */}
        <TabsContent value="blog" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form Column */}
            <Card className="lg:col-span-5 shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Article Parameters</CardTitle>
                <CardDescription className="text-xs">Define topic, keywords, and target depth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Article Topic / Working Title
                  </label>
                  <input
                    value={blogTopic}
                    onChange={(e) => setBlogTopic(e.target.value)}
                    placeholder="Enter article topic (e.g. Scaling B2B SaaS Growth in 2026)..."
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Primary Target Keyword (SEO)
                  </label>
                  <input
                    value={blogKeyword}
                    onChange={(e) => setBlogKeyword(e.target.value)}
                    placeholder="Enter focus keyword (e.g. saas marketing automation)..."
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Article Length Target
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["short", "medium", "long"] as const).map((len) => (
                      <button
                        key={len}
                        type="button"
                        onClick={() => setBlogLength(len)}
                        className={`h-10 rounded-xl border text-xs font-bold capitalize transition-all ${
                          blogLength === len
                            ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                            : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {len} (~{len === "short" ? "800w" : len === "medium" ? "1,500w" : "2,500w"})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-teal-50/60 p-3.5 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/40 text-[11px] text-teal-900 dark:text-teal-200">
                  ⚡ <strong>Brand Guidelines Applied:</strong> Automatically injects active workspace brand voice and positioning.
                </div>

                <Button
                  onClick={() => handleGenerate("blog")}
                  disabled={isLoading || !blogTopic.trim()}
                  variant="gradient"
                  className="w-full h-11 text-xs font-bold gap-2 shadow-md hover:scale-[1.01] transition-transform"
                >
                  <Sparkles className="h-4 w-4" />
                  {isLoading ? "Generating Full Article & Metadata..." : "Generate SEO Article"}
                </Button>
              </CardContent>
            </Card>

            {/* Output & Editor Column */}
            <Card className="lg:col-span-7 shadow-sm border-slate-200 dark:border-slate-800 flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-bold">Article Output & Live Editor</CardTitle>
                  {generatedBlog && (
                    <Badge variant="success" className="text-[10px]">
                      SEO Score: {generatedBlog.seoScore || 94}/100
                    </Badge>
                  )}
                </div>

                {generatedBlog && (
                  <div className="flex items-center gap-2">
                    {/* View Mode Toggle */}
                    <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-900 text-xs">
                      <button
                        onClick={() => setBlogViewMode("preview")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                          blogViewMode === "preview"
                            ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        <Eye className="h-3 w-3" /> Preview
                      </button>
                      <button
                        onClick={() => setBlogViewMode("edit")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                          blogViewMode === "edit"
                            ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        <Edit3 className="h-3 w-3" /> Markdown
                      </button>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(editableBody, "blog")}
                      className="h-8 text-xs gap-1"
                    >
                      {copiedKey === "blog" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === "blog" ? "Copied" : "Copy"}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="gradient"
                      onClick={() => handleSaveDraft(generatedBlog?.title || blogTopic, "blog", editableBody)}
                      className="h-8 text-xs gap-1 shadow-sm font-bold"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Draft</span>
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-4 flex-1">
                {!generatedBlog ? (
                  <div className="h-80 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <FileText className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">No article generated yet</div>
                      <p className="text-xs text-slate-500 max-w-sm">
                        Enter your article topic, target keyword, and depth on the left, then click "Generate SEO Article".
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Meta Tags Quick Card */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-slate-500">Meta Title: </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{generatedBlog?.metaTitle}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500">Meta Description: </span>
                        <span className="text-slate-700 dark:text-slate-300">{generatedBlog?.metaDescription}</span>
                      </div>
                    </div>

                    {/* Body Content: Preview or Markdown Editor */}
                    {blogViewMode === "preview" ? (
                      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[380px] max-h-[500px] overflow-y-auto">
                        <FormattedMarkdown content={editableBody} />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500">Article Content (Markdown Editable):</label>
                        <textarea
                          value={editableBody}
                          onChange={(e) => setEditableBody(e.target.value)}
                          rows={16}
                          className="w-full p-4 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-mono font-medium text-slate-900 dark:text-slate-100 leading-relaxed outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. SOCIAL MEDIA POST GENERATOR */}
        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-5 shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Social Post Parameters</CardTitle>
                <CardDescription className="text-xs">Create cross-platform copy bundles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Topic / Core Message</label>
                  <textarea
                    value={socialTopic}
                    onChange={(e) => setSocialTopic(e.target.value)}
                    rows={3}
                    placeholder="Enter social post topic or hook (e.g. 5 lessons from bootstrapping our D2C brand)..."
                    className="w-full p-3.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Tone & Personality (Optional)</label>
                  <input
                    value={socialTone}
                    onChange={(e) => setSocialTone(e.target.value)}
                    placeholder="e.g. Inspiring, Educational, Punchy, Playful..."
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-xs"
                  />
                </div>

                <Button
                  onClick={() => handleGenerate("social")}
                  disabled={isLoading || !socialTopic.trim()}
                  variant="gradient"
                  className="w-full h-11 text-xs font-bold gap-2 shadow-md hover:scale-[1.01] transition-transform"
                >
                  <Sparkles className="h-4 w-4" />
                  {isLoading ? "Generating Multi-Platform Bundle..." : "Generate Social Bundle"}
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-7 shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-sm font-bold">Generated Platform Variations</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {!generatedSocial ? (
                  <div className="h-80 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <Share2 className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">No social posts generated yet</div>
                      <p className="text-xs text-slate-500 max-w-sm">Enter a topic on the left and click "Generate Social Bundle".</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Instagram Variation */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <Badge variant="purple" className="text-[10px]">Instagram Caption</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(generatedSocial?.platforms?.instagram, "insta")}
                          className="h-7 text-xs gap-1 font-semibold"
                        >
                          {copiedKey === "insta" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                          Copy
                        </Button>
                      </div>
                      <p className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {generatedSocial?.platforms?.instagram}
                      </p>
                    </div>

                    {/* LinkedIn Variation */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <Badge variant="blue" className="text-[10px]">LinkedIn Thought Leadership</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(generatedSocial?.platforms?.linkedin, "link")}
                          className="h-7 text-xs gap-1 font-semibold"
                        >
                          {copiedKey === "link" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                          Copy
                        </Button>
                      </div>
                      <p className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {generatedSocial?.platforms?.linkedin}
                      </p>
                    </div>

                    {/* X / Twitter Variation */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-[10px]">X (Twitter) Thread Starter</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(generatedSocial?.platforms?.x_twitter, "xtw")}
                          className="h-7 text-xs gap-1 font-semibold"
                        >
                          {copiedKey === "xtw" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                          Copy
                        </Button>
                      </div>
                      <p className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {generatedSocial?.platforms?.x_twitter}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 3. AD COPY GENERATOR */}
        <TabsContent value="ads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-5 shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Ad Campaign Brief</CardTitle>
                <CardDescription className="text-xs">Generate compliant Google & Meta Ad assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Product or Offer</label>
                  <input
                    value={adProduct}
                    onChange={(e) => setAdProduct(e.target.value)}
                    placeholder="Enter product or service name..."
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Offer / Promotion Details</label>
                  <textarea
                    value={adOffer}
                    onChange={(e) => setAdOffer(e.target.value)}
                    rows={3}
                    placeholder="e.g. 20% discount with code SAVE20 + Free Delivery..."
                    className="w-full p-3.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-xs"
                  />
                </div>

                <Button
                  onClick={() => handleGenerate("ads")}
                  disabled={isLoading || !adProduct.trim()}
                  variant="gradient"
                  className="w-full h-11 text-xs font-bold gap-2 shadow-md hover:scale-[1.01] transition-transform"
                >
                  <Sparkles className="h-4 w-4" />
                  {isLoading ? "Generating High-Converting Ad Copy..." : "Generate 5 Ad Variations"}
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-7 shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-sm font-bold">Google & Meta Ad Creatives</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs">
                {!generatedAds ? (
                  <div className="h-80 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <Flame className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">No ad creatives generated yet</div>
                      <p className="text-xs text-slate-500 max-w-sm">Enter your product details on the left and click "Generate 5 Ad Variations".</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Google Ads */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 space-y-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                        <span>Google Search Ad Copy</span>
                        <Badge variant="secondary" className="text-[10px]">Headlines & Descriptions</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] font-semibold text-slate-500">Headlines:</div>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-800 dark:text-slate-200 font-medium">
                          {generatedAds?.googleAds?.headlines?.map((h: string, idx: number) => (
                            <li key={idx}>{h}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] font-semibold text-slate-500">Descriptions:</div>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-800 dark:text-slate-200 font-medium">
                          {generatedAds?.googleAds?.descriptions?.map((d: string, idx: number) => (
                            <li key={idx}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Meta Ads */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 space-y-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                        <span>Meta (Facebook & Instagram) Primary Text Hooks</span>
                        <Badge variant="purple" className="text-[10px]">High CTR Angles</Badge>
                      </div>
                      {generatedAds?.metaAds?.primaryTextVariations?.map((pt: string, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-[11px] text-teal-700 dark:text-teal-400 mb-1">Variation {idx + 1}:</div>
                          <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{pt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 4. EMAIL MARKETING GENERATOR */}
        <TabsContent value="email" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-5 shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Email Campaign Brief</CardTitle>
                <CardDescription className="text-xs">Create subject line tests & high-open sequences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Campaign Type</label>
                  <select
                    value={emailType}
                    onChange={(e) => setEmailType(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-xs"
                  >
                    <option value="welcome">Welcome Onboarding Sequence</option>
                    <option value="newsletter">Product Launch / Newsletter</option>
                    <option value="cart_recovery">Abandoned Checkout Recovery</option>
                    <option value="promo">Flash Promotion (Limited Time)</option>
                    <option value="reengagement">Inactive Subscriber Win-Back</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Core Goal / Topic</label>
                  <input
                    value={emailGoal}
                    onChange={(e) => setEmailGoal(e.target.value)}
                    placeholder="Enter email goal (e.g. Early Access Product Launch)..."
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-xs"
                  />
                </div>

                <Button
                  onClick={() => handleGenerate("email")}
                  disabled={isLoading || !emailGoal.trim()}
                  variant="gradient"
                  className="w-full h-11 text-xs font-bold gap-2 shadow-md hover:scale-[1.01] transition-transform"
                >
                  <Sparkles className="h-4 w-4" />
                  {isLoading ? "Drafting High-Converting Email..." : "Generate Email Sequence"}
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-7 shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-sm font-bold">Email Copy & Subject Line Tests</CardTitle>
                {generatedEmail && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(generatedEmail?.body || "", "email")}
                    className="h-8 text-xs gap-1 font-semibold"
                  >
                    {copiedKey === "email" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === "email" ? "Copied" : "Copy"}</span>
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs">
                {!generatedEmail ? (
                  <div className="h-80 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <Mail className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">No email draft generated yet</div>
                      <p className="text-xs text-slate-500 max-w-sm">Select campaign type and enter your core goal on the left.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Subject Line Variations */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 space-y-2">
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                        <span>4 Subject Line A/B Test Variations</span>
                        <Badge variant="success" className="text-[10px]">Predicted Open Rate: 44.8%</Badge>
                      </div>
                      <ul className="space-y-1.5 pt-1">
                        {generatedEmail?.subjectLines?.map((subj: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/60 text-[9px] font-bold text-teal-800 dark:text-teal-300">
                              {idx + 1}
                            </span>
                            <span>{subj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Body Preview */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-500">Email Body:</label>
                      <textarea
                        value={generatedEmail?.body || ""}
                        onChange={(e) => setGeneratedEmail({ ...generatedEmail, body: e.target.value })}
                        rows={12}
                        className="w-full p-4 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-mono font-medium text-slate-900 dark:text-slate-100 leading-relaxed outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-sm"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

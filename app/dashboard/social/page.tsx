"use client";

import * as React from "react";
import Link from "next/link";
import {
  Share2,
  Sparkles,
  Plus,
  Heart,
  MessageCircle,
  Repeat,
  Eye,
  MousePointerClick,
  CheckCircle2,
  Send,
  Calendar,
  Trash2,
  Edit3,
  Copy,
  Check,
  Globe,
  Radio,
  Sliders,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatNumber } from "@/lib/utils";
import { trackMarketingEvent } from "@/lib/firebase";

export default function SocialMediaPage() {
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [posts, setPosts] = React.useState<any[]>([]);
  const [filterPlatform, setFilterPlatform] = React.useState("ALL");
  const [isLoading, setIsLoading] = React.useState(true);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPostId, setEditingPostId] = React.useState<string | null>(null);
  const [postPlatform, setPostPlatform] = React.useState("INSTAGRAM");
  const [postCaption, setPostCaption] = React.useState("");
  const [postHashtags, setPostHashtags] = React.useState("");
  const [postSchedule, setPostSchedule] = React.useState("");
  const [isPublishImmediately, setIsPublishImmediately] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isAIEnhancing, setIsAIEnhancing] = React.useState(false);

  const fetchSocialData = async () => {
    try {
      const res = await fetch("/api/social");
      const json = await res.json();
      if (json.accounts) setAccounts(json.accounts);
      if (json.posts) setPosts(json.posts);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSocialData();
  }, []);

  // 1. CREATE or UPDATE POST
  const handleSavePost = async () => {
    if (!postCaption.trim()) return;
    setIsSubmitting(true);

    try {
      if (editingPostId) {
        // UPDATE
        const res = await fetch("/api/social", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingPostId,
            caption: postCaption,
            platform: postPlatform,
            scheduledFor: isPublishImmediately ? null : postSchedule,
            status: isPublishImmediately ? "PUBLISHED" : "SCHEDULED",
          }),
        });
        const json = await res.json();
        if (json.post) {
          setPosts((prev) => prev.map((p) => (p.id === editingPostId ? json.post : p)));
        }
      } else {
        // CREATE
        const res = await fetch("/api/social", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform: postPlatform,
            caption: postCaption,
            hashtags: postHashtags,
            scheduledFor: isPublishImmediately ? null : postSchedule,
            status: isPublishImmediately ? "PUBLISHED" : "SCHEDULED",
          }),
        });
        const json = await res.json();
        if (json.post) {
          setPosts((prev) => [json.post, ...prev]);
          trackMarketingEvent("create_social_post", { platform: postPlatform });
        }
      }
      setIsModalOpen(false);
      resetForm();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. INSTANT PUBLISH NOW
  const handlePublishNow = async (id: string) => {
    try {
      const res = await fetch("/api/social", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "PUBLISHED" }),
      });
      const json = await res.json();
      if (json.post) {
        setPosts((prev) => prev.map((p) => (p.id === id ? json.post : p)));
        trackMarketingEvent("publish_social_post_now", { id });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 3. DELETE POST
  const handleDeletePost = async (id: string) => {
    try {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      await fetch(`/api/social?id=${id}`, { method: "DELETE" });
      trackMarketingEvent("delete_social_post", { id });
    } catch (e) {
      console.error(e);
    }
  };

  // 4. TOGGLE ACCOUNT CONNECTION
  const handleToggleAccount = async (accountId: string, currentStatus: boolean) => {
    try {
      const nextStatus = !currentStatus;
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === accountId ? { ...acc, isConnected: nextStatus } : acc))
      );
      await fetch("/api/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_account", accountId, isConnected: nextStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // 5. AI ENHANCE CAPTION
  const handleAIEnhance = async () => {
    if (!postCaption.trim()) return;
    setIsAIEnhancing(true);
    try {
      const res = await fetch("/api/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ai_enhance", prompt: postCaption, platform: postPlatform }),
      });
      const json = await res.json();
      if (json.enhancedCaption) {
        setPostCaption(json.enhancedCaption);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAIEnhancing(false);
    }
  };

  const handleCopyCaption = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenEdit = (post: any) => {
    setEditingPostId(post.id);
    setPostPlatform(post.platform);
    setPostCaption(post.caption);
    setPostHashtags(post.hashtags || "");
    setIsPublishImmediately(post.status === "PUBLISHED");
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingPostId(null);
    setPostCaption("");
    setPostPlatform("INSTAGRAM");
    setPostHashtags("");
    setIsPublishImmediately(true);
  };

  // Metrics summary
  const totalImpressions = posts.reduce((acc, p) => acc + (p.impressions || 0), 0);
  const totalLikes = posts.reduce((acc, p) => acc + (p.likes || 0), 0);
  const totalComments = posts.reduce((acc, p) => acc + (p.comments || 0), 0);
  const totalFollowers = accounts.reduce((acc, a) => acc + (a.followers || 0), 0);

  const filteredPosts = posts.filter((p) => {
    if (filterPlatform === "ALL") return true;
    return p.platform === filterPlatform;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-1 border border-teal-200 dark:border-teal-800">
            <Share2 className="h-3 w-3" />
            <span>Social Operations Hub (Real-Time CRUD)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Multi-Channel Social Management & Live Publishing
          </h1>
          <p className="text-xs text-slate-500">
            Create, schedule, publish, edit, and track live social engagements across Instagram, LinkedIn, X, and YouTube.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            variant="gradient"
            size="sm"
            className="text-xs font-bold gap-1.5 shadow-md hover:scale-[1.01] transition-transform"
          >
            <Plus className="h-4 w-4" />
            <span>Compose New Post</span>
          </Button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Audience</div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{formatNumber(totalFollowers)}</div>
              <div className="text-[10px] text-emerald-600 font-medium">4 Connected Handles</div>
            </div>
            <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center">
              <Globe className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Reach (Est.)</div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{formatNumber(totalImpressions)}</div>
              <div className="text-[10px] text-emerald-600 font-medium">+24.5% this month</div>
            </div>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center">
              <Eye className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Likes</div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{formatNumber(totalLikes)}</div>
              <div className="text-[10px] text-rose-600 font-medium">❤️ Real-time engagements</div>
            </div>
            <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center">
              <Heart className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Comments & Replies</div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{formatNumber(totalComments)}</div>
              <div className="text-[10px] text-teal-600 font-medium">💬 98% response velocity</div>
            </div>
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center">
              <MessageCircle className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Accounts Manager Bar */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold">Connected Social Channels</CardTitle>
              <CardDescription className="text-xs">Manage active publishing pipelines and credentials</CardDescription>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              {accounts.filter((a) => a.isConnected).length} of {accounts.length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  acc.isConnected
                    ? "border-teal-200 bg-teal-50/30 dark:border-teal-900/40 dark:bg-teal-950/20"
                    : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 opacity-60"
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{acc.accountName}</div>
                  <div className="text-[11px] font-mono text-teal-700 dark:text-teal-400">{acc.handle}</div>
                  <div className="text-[10px] text-slate-500">{formatNumber(acc.followers)} Followers</div>
                </div>
                <Button
                  size="sm"
                  variant={acc.isConnected ? "outline" : "secondary"}
                  onClick={() => handleToggleAccount(acc.id, acc.isConnected)}
                  className="h-7 text-[11px] px-2.5"
                >
                  {acc.isConnected ? "Connected" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Filter Tabs & Posts Feed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { label: "All Posts", value: "ALL" },
              { label: "Instagram", value: "INSTAGRAM" },
              { label: "LinkedIn", value: "LINKEDIN" },
              { label: "X (Twitter)", value: "X_TWITTER" },
              { label: "YouTube", value: "YOUTUBE" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterPlatform(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterPlatform === tab.value
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredPosts.length} post{filteredPosts.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Live Posts List */}
        <div className="space-y-3">
          {filteredPosts.length === 0 ? (
            <Card className="p-8 text-center text-slate-400 border-dashed">
              <Share2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No posts found in this filter. Click "Compose New Post" above to publish one!</p>
            </Card>
          ) : (
            filteredPosts.map((post) => {
              const isPublished = post.status === "PUBLISHED";
              return (
                <Card key={post.id} className="shadow-sm border-slate-200 dark:border-slate-800 hover:border-slate-300 transition-all">
                  <CardContent className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            post.platform === "INSTAGRAM"
                              ? "purple"
                              : post.platform === "LINKEDIN"
                              ? "blue"
                              : post.platform === "X_TWITTER"
                              ? "secondary"
                              : "destructive"
                          }
                          className="text-[10px] font-bold"
                        >
                          {post.platform.replace("_", " ")}
                        </Badge>
                        <Badge variant={isPublished ? "success" : "warning"} className="text-[10px]">
                          {post.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!isPublished && (
                          <Button
                            size="sm"
                            variant="gradient"
                            onClick={() => handlePublishNow(post.id)}
                            className="h-7 text-[11px] font-bold gap-1 shadow-xs"
                          >
                            <Send className="h-3 w-3" />
                            <span>Publish Now</span>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyCaption(post.caption, post.id)}
                          className="h-7 text-xs px-2"
                        >
                          {copiedId === post.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEdit(post)}
                          className="h-7 text-xs px-2 text-slate-600 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeletePost(post.id)}
                          className="h-7 text-xs px-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Caption */}
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-medium leading-relaxed">
                      {post.caption}
                    </p>

                    {post.hashtags && (
                      <div className="text-xs font-mono text-teal-600 dark:text-teal-400">
                        {post.hashtags}
                      </div>
                    )}

                    {/* Telemetry Engagement Bar */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5 text-rose-500" />
                          <strong className="text-slate-800 dark:text-slate-200">{formatNumber(post.likes || 0)}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3.5 w-3.5 text-blue-500" />
                          <strong className="text-slate-800 dark:text-slate-200">{formatNumber(post.comments || 0)}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Repeat className="h-3.5 w-3.5 text-emerald-500" />
                          <strong className="text-slate-800 dark:text-slate-200">{formatNumber(post.shares || 0)}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5 text-purple-500" />
                          <strong className="text-slate-800 dark:text-slate-200">{formatNumber(post.impressions || 0)}</strong>
                        </span>
                      </div>

                      <span className="text-[11px]">
                        {isPublished ? `Published ${new Date(post.publishedAt || post.createdAt).toLocaleDateString()}` : "Scheduled in Queue"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Compose / Edit Post Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Share2 className="h-4 w-4 text-teal-600" />
              {editingPostId ? "Edit Social Post" : "Compose New Multi-Platform Post"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Craft captions, inject AI viral hooks & hashtags, and publish in real time.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Target Social Platform</label>
              <select
                value={postPlatform}
                onChange={(e) => setPostPlatform(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="INSTAGRAM">Instagram (Reels & Feed)</option>
                <option value="LINKEDIN">LinkedIn Thought Leadership</option>
                <option value="X_TWITTER">X (Twitter Thread / Post)</option>
                <option value="YOUTUBE">YouTube Community & Shorts</option>
                <option value="FACEBOOK">Facebook Page</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Post Caption / Body</label>
                <button
                  type="button"
                  onClick={handleAIEnhance}
                  disabled={isAIEnhancing || !postCaption}
                  className="text-[11px] font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 flex items-center gap-1 disabled:opacity-50"
                >
                  <Sparkles className="h-3 w-3" />
                  {isAIEnhancing ? "AI Enhancing..." : "✨ AI Hook & Hashtag Polish"}
                </button>
              </div>
              <textarea
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value)}
                rows={5}
                placeholder="Write your social post here or type a rough thought and click 'AI Hook & Hashtag Polish'..."
                className="w-full p-3.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Hashtags</label>
              <input
                value={postHashtags}
                onChange={(e) => setPostHashtags(e.target.value)}
                placeholder="Enter hashtags (e.g. #marketing #launch #startup)..."
                className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs font-mono text-teal-600 dark:text-teal-400 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">Publish Immediately</div>
                <div className="text-[10px] text-slate-500">Go live right now with real-time impression telemetry</div>
              </div>
              <input
                type="checkbox"
                checked={isPublishImmediately}
                onChange={(e) => setIsPublishImmediately(e.target.checked)}
                className="h-4 w-4 text-teal-600 rounded"
              />
            </div>

            <Button
              onClick={handleSavePost}
              disabled={isSubmitting || !postCaption}
              variant="gradient"
              className="w-full h-11 text-xs font-bold gap-2 shadow-md"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isSubmitting ? "Saving Post..." : editingPostId ? "Update Post" : isPublishImmediately ? "Publish Post Now" : "Schedule Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

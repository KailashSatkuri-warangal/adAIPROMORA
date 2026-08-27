"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  Sparkles,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Share2,
  FileText,
  Mail,
  Flame,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function CalendarPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [viewMode, setViewMode] = React.useState<"month" | "list">("month");
  const [isGenerateOpen, setIsGenerateOpen] = React.useState(false);
  const [focusTheme, setFocusTheme] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [filterPlatform, setFilterPlatform] = React.useState("ALL");

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/ai/calendar-generate");
      const json = await res.json();
      if (json.items) {
        setItems(json.items);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchItems();
  }, []);

  const handleGenerate30Day = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/calendar-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          focusTheme,
          platforms: ["INSTAGRAM", "LINKEDIN", "X_TWITTER", "BLOG", "EMAIL"],
          cadencePerWeek: 4,
        }),
      });
      const json = await res.json();
      if (json.items) {
        setItems((prev) => [...prev, ...json.items]);
        setIsGenerateOpen(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterPlatform === "ALL") return true;
    return item.platform === filterPlatform;
  });

  // Calendar Grid Days for Current Month (March 2026 / 35 cells)
  const daysInMonth = 31;
  const startDayOffset = 0; // Sunday

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-1 border border-teal-200 dark:border-teal-800">
            <CalendarIcon className="h-3 w-3" />
            <span>Visual Content Calendar</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Multi-Channel Scheduling & Editorial Calendar
          </h1>
          <p className="text-xs text-slate-500">
            Organize, schedule, and approve posts across Instagram, LinkedIn, X, Blog, and Email with 30-day AI automation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsGenerateOpen(true)}
            variant="gradient"
            size="sm"
            className="h-10 px-4 text-xs font-bold gap-2 shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate 30-Day Calendar</span>
          </Button>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {["ALL", "INSTAGRAM", "LINKEDIN", "X_TWITTER", "THREADS"].map((plat) => (
            <button
              key={plat}
              onClick={() => setFilterPlatform(plat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterPlatform === plat
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {plat.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 self-end">
          <Button
            variant={viewMode === "month" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("month")}
            className="h-8 text-xs gap-1"
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Month
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-8 text-xs gap-1"
          >
            <List className="h-3.5 w-3.5" /> List Queue
          </Button>
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === "month" ? (
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-center text-xs font-semibold py-2.5 text-slate-500">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/80 min-h-[560px]">
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i + 1;
              const hasDay = dayNum <= daysInMonth;
              const dayItems = filteredItems.filter((item) => {
                const itemDay = new Date(item.scheduledDate).getDate();
                return hasDay && itemDay === dayNum;
              });

              return (
                <div
                  key={i}
                  className={`p-2 transition-colors min-h-[110px] ${
                    hasDay ? "bg-white dark:bg-slate-950 hover:bg-slate-50/50 dark:hover:bg-slate-900/30" : "bg-slate-50/50 dark:bg-slate-900/20"
                  }`}
                >
                  {hasDay && (
                    <>
                      <div className="text-[11px] font-bold text-slate-400 mb-1.5">{dayNum}</div>
                      <div className="space-y-1">
                        {dayItems.map((post) => (
                          <div
                            key={post.id}
                            className="p-1.5 rounded-lg border text-[10px] space-y-0.5 transition-all hover:scale-[1.02] cursor-pointer bg-teal-50/70 border-teal-200 dark:bg-teal-950/40 dark:border-teal-900"
                          >
                            <div className="flex items-center justify-between font-semibold text-teal-900 dark:text-teal-200">
                              <span>{post.platform.slice(0, 3)}</span>
                              <span className="text-[9px] opacity-70">{post.status}</span>
                            </div>
                            <div className="line-clamp-2 text-slate-700 dark:text-slate-300 font-medium">
                              {post.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        /* LIST QUEUE VIEW */
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm font-bold">Content Queue ({filteredItems.length} items)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 flex items-center justify-center shrink-0 font-bold">
                      {item.platform.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {item.title}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Scheduled for: {new Date(item.scheduledDate).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} • Assigned to: {item.assignedUser || "Alex"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Badge
                      variant={
                        item.status === "PUBLISHED"
                          ? "success"
                          : item.status === "SCHEDULED"
                          ? "purple"
                          : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate 30-Day AI Calendar Modal Dialog */}
      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-600" />
              Generate 30-Day Content Calendar
            </DialogTitle>
            <DialogDescription className="text-xs">
              AI will construct a personalized multi-channel posting blueprint based on your active brand persona.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Monthly Theme / Focus Campaign
              </label>
              <input
                value={focusTheme}
                onChange={(e) => setFocusTheme(e.target.value)}
                placeholder="Enter monthly theme (e.g. Q4 Festive Scale & Acquisition)..."
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-xs"
              />
            </div>

            <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/50 dark:border-teal-800/40 text-[11px] text-teal-800 dark:text-teal-300">
              📅 Will schedule 15 high-converting posts across Instagram, LinkedIn, X, and Email over the next 30 days.
            </div>

            <Button
              onClick={handleGenerate30Day}
              disabled={isGenerating || !focusTheme}
              className="w-full h-11 text-xs font-bold gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Building 30-Day Schedule..." : "Auto-Generate 30-Day Schedule"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

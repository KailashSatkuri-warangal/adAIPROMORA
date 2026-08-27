"use client";

import * as React from "react";
import {
  Bot,
  Send,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Download,
  Share2,
  Bookmark,
  Building,
  Target,
  FileText,
  User,
  Plus,
  Trash2,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormattedMarkdown } from "@/components/ui/formatted-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string | Date;
  model?: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
}

export default function AssistantPage() {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [savedId, setSavedId] = React.useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Create a complete 30-day marketing strategy to scale our brand in India to ₹50,00,000/mo.",
    "Write 3 high-converting Meta ad hooks for our Ayurvedic barrier repair serum.",
    "Draft a 4-step abandoned checkout email sequence with festive discount triggers.",
    "How can we outperform competitor DermaPure India on Google search across Bengaluru & Mumbai?",
    "Generate 5 engaging LinkedIn thought-leadership post concepts for our founder.",
  ];

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/ai/chat");
      const data = await res.json();
      if (data.conversations && data.conversations.length > 0) {
        setConversations(data.conversations);
        if (!activeConvId) {
          setActiveConvId(data.conversations[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchConversations();
  }, []);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeConvId, isLoading]);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSend = async (customPrompt?: string) => {
    const text = customPrompt || input;
    if (!text.trim() || isLoading) return;

    setInput("");
    setIsLoading(true);

    const tempUserMsg: Message = {
      id: "temp-" + Date.now(),
      role: "user",
      content: text,
      createdAt: new Date(),
    };

    if (activeConv) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? { ...c, messages: [...c.messages, tempUserMsg] }
            : c
        )
      );
    }

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationId: activeConvId,
        }),
      });

      const data = await res.json();
      if (data.message) {
        if (!activeConvId) {
          setActiveConvId(data.conversationId);
        }
        await fetchConversations();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportMarkdown = () => {
    if (!activeConv) return;
    const mdContent = activeConv.messages
      .map((m) => `### ${m.role === "user" ? "User" : "OmniMarket AI Assistant"}\n\n${m.content}\n\n---`)
      .join("\n\n");
    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `omnimarket-strategy-${Date.now()}.md`;
    a.click();
  };

  const handleNewChat = () => {
    setActiveConvId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8.5rem)] animate-in fade-in duration-200">
      {/* Left Column: Conversation History Sidebar */}
      <Card className="hidden lg:flex flex-col h-full shadow-sm col-span-1 border-slate-200 dark:border-slate-800">
        <CardHeader className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold">Strategy Chats</CardTitle>
            <CardDescription className="text-[11px]">Saved AI Sessions</CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleNewChat}
            className="h-8 px-2.5 text-xs text-teal-700 dark:text-teal-400 gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </Button>
        </CardHeader>
        <CardContent className="p-2 flex-1 overflow-y-auto space-y-1">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No previous conversations. Start by asking a question!
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between group ${
                  conv.id === activeConvId
                    ? "bg-teal-50 dark:bg-teal-950/60 font-semibold text-teal-900 dark:text-teal-200 border border-teal-200 dark:border-teal-800"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Bot className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{conv.title}</span>
                </div>
                <span className="text-[10px] text-slate-400 opacity-60">
                  {conv.messages.length}
                </span>
              </button>
            ))
          )}
        </CardContent>
      </Card>

      {/* Main Column: Conversational Chat Interface */}
      <Card className="flex flex-col h-full shadow-sm col-span-1 lg:col-span-3 border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Chat Top Action Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3.5 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>AI Marketing Strategist & Growth Assistant</span>
                <Badge variant="success" className="text-[9px] py-0">Online</Badge>
              </div>
              <div className="text-[11px] text-slate-500">
                Context Injected: <span className="font-semibold text-slate-700 dark:text-slate-300">VedaGlow Organics India</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportMarkdown}
              className="h-8 text-xs gap-1.5"
              title="Export conversation as Markdown"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Chat Messages Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!activeConv || activeConv.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-xl mx-auto space-y-4 py-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 shadow-md">
                <Sparkles className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  What growth challenge can I solve for you today?
                </h3>
                <p className="text-xs text-slate-500 max-w-md">
                  I understand your brand voice, active campaigns, target persona, and SEO rankings. Select a prompt or ask any marketing question:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-2">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-teal-50/50 hover:border-teal-300 text-left text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-teal-700 transition-all flex items-start gap-2 group"
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            activeConv.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-5 text-xs sm:text-sm shadow-md transition-all ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-teal-500/10 font-medium"
                      : "bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-slate-200/50 dark:shadow-none"
                  }`}
                >
                  {msg.role === "user" ? (
                    <div className="whitespace-pre-wrap leading-relaxed text-white font-medium">
                      {msg.content}
                    </div>
                  ) : (
                    <FormattedMarkdown content={msg.content} />
                  )}

                  {msg.role === "assistant" && (
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-mono text-[10px] text-teal-700 dark:text-teal-400 font-semibold">
                        ⚡ {msg.model || "adAIPROMORA-domain-v1 (by Satkuri Kailash)"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center gap-1 font-semibold transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          {copiedId === msg.id ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm dark:bg-slate-700">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white">
                <Bot className="h-4 w-4 animate-bounce" />
              </div>
              <div className="rounded-2xl bg-white p-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-teal-600 animate-spin" />
                Synthesizing multi-channel marketing recommendations...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <div className="relative flex-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI for strategy, ad copy, email funnels, or SEO analysis..."
                className="flex h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 shadow-sm"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              variant="gradient"
              className="h-12 px-6 rounded-xl text-xs font-bold gap-2 shadow-md hover:scale-[1.02] transition-transform"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

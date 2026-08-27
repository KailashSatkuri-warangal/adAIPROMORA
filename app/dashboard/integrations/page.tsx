"use client";

import * as React from "react";
import {
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  RefreshCw,
  Sliders,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = React.useState<any[]>([
    {
      id: "ga4",
      name: "Google Analytics 4",
      desc: "Real-time user sessions, bounce rates, and conversion events.",
      isConnected: true,
      category: "Analytics",
    },
    {
      id: "gsc",
      name: "Google Search Console",
      desc: "Organic impressions, search queries, and technical indexing.",
      isConnected: true,
      category: "SEO",
    },
    {
      id: "meta",
      name: "Meta Ads & Instagram Graph",
      desc: "Campaign spend, ROAS attribution, and automated ad creative deployment.",
      isConnected: true,
      category: "Paid Ads",
    },
    {
      id: "google_ads",
      name: "Google Ads Engine",
      desc: "Search, Display, and Performance Max campaign telemetry.",
      isConnected: false,
      category: "Paid Ads",
    },
    {
      id: "mailchimp",
      name: "Mailchimp / Klaviyo",
      desc: "Audience sync, lifecycle email triggers, and open/click tracking.",
      isConnected: true,
      category: "Email",
    },
    {
      id: "slack",
      name: "Slack Marketing Alerts",
      desc: "Instant Slack alerts for high ROAS spikes and daily marketing digests.",
      isConnected: false,
      category: "Automation",
    },
  ]);

  const handleToggleConnect = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isConnected: !item.isConnected } : item
      )
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-1 border border-teal-200 dark:border-teal-800">
            <Layers className="h-3 w-3" />
            <span>Integrations Ecosystem</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Connected Marketing Tools & Data Pipelines
          </h1>
          <p className="text-xs text-slate-500">
            Sync real-time telemetry from Google Analytics, Search Console, Meta, and Mailchimp. Missing credentials display a clear connection prompt.
          </p>
        </div>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <Card key={item.id} className="shadow-sm border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-bold">{item.name}</CardTitle>
                  <span className="text-[10px] text-slate-400 font-medium">{item.category}</span>
                </div>
                <Badge variant={item.isConnected ? "success" : "secondary"} className="text-[10px]">
                  {item.isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.desc}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {item.isConnected ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Pipeline Active
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">OAuth Required</span>
                )}

                <Button
                  variant={item.isConnected ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleToggleConnect(item.id)}
                  className="h-8 text-xs font-semibold"
                >
                  {item.isConnected ? "Disconnect" : "Connect Tool"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

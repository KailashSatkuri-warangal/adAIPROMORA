"use client";

import * as React from "react";
import Link from "next/link";
import {
  Mail,
  Sparkles,
  Users,
  Send,
  CheckCircle2,
  TrendingUp,
  Percent,
  Plus,
  ArrowRight,
  Filter,
  Eye,
  MousePointerClick,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";

export default function EmailMarketingPage() {
  const [contacts, setContacts] = React.useState<any[]>([]);
  const [campaigns, setCampaigns] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch("/api/email/contacts")
      .then((r) => r.json())
      .then((d) => {
        if (d.contacts) setContacts(d.contacts);
        if (d.campaigns) setCampaigns(d.campaigns);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-1 border border-teal-200 dark:border-teal-800">
            <Mail className="h-3 w-3" />
            <span>Email Marketing Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Lifecycle Email Marketing & Audience Segmentation
          </h1>
          <p className="text-xs text-slate-500">
            Manage customer lists, send automated nurture drips, and optimize subject lines with AI.
          </p>
        </div>

        <Link href="/dashboard/content?tab=email">
          <Button variant="gradient" size="sm" className="text-xs font-bold gap-1.5 shadow-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Email Sequence Builder</span>
          </Button>
        </Link>
      </div>

      {/* Top 3 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Average Open Rate
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                46.8%
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">+14.2% vs industry avg</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center">
              <Eye className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Average Click-Through
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                14.2%
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Exceptional CTR score</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center">
              <MousePointerClick className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Subscribed Audience
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {formatNumber(4850)}
              </div>
              <span className="text-[11px] text-teal-600 font-medium">99.6% deliverability rate</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Email Campaigns vs Contacts List */}
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid grid-cols-2 max-w-sm h-11">
          <TabsTrigger value="campaigns" className="text-xs gap-1.5">
            <Send className="h-3.5 w-3.5" /> Email Drops
          </TabsTrigger>
          <TabsTrigger value="contacts" className="text-xs gap-1.5">
            <Users className="h-3.5 w-3.5" /> Contact Audience
          </TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          {campaigns.map((camp) => (
            <Card key={camp.id} className="shadow-sm border-slate-200 dark:border-slate-800">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{camp.name}</h3>
                    <Badge variant="success" className="text-[10px] uppercase">{camp.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Subject: "{camp.subject}"
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Sent to {formatNumber(camp.recipientsCount)} recipients
                  </p>
                </div>

                <div className="flex items-center gap-6 text-xs text-center">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{camp.openRate}%</div>
                    <div className="text-[10px] text-slate-500">Open Rate</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{camp.clickRate}%</div>
                    <div className="text-[10px] text-slate-500">Click Rate</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{camp.bounceRate}%</div>
                    <div className="text-[10px] text-slate-500">Bounce</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold">Contact Directory & Segment Tags</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-slate-500">
                    <tr>
                      <th className="p-3.5 font-semibold">Contact Email</th>
                      <th className="p-3.5 font-semibold">Name</th>
                      <th className="p-3.5 font-semibold">Company</th>
                      <th className="p-3.5 font-semibold">Segments & Tags</th>
                      <th className="p-3.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {contacts.map((c) => {
                      const tags: string[] = c.tagsJson ? JSON.parse(c.tagsJson) : [];
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                          <td className="p-3.5 font-medium text-slate-900 dark:text-slate-100">{c.email}</td>
                          <td className="p-3.5">{c.firstName} {c.lastName}</td>
                          <td className="p-3.5 text-slate-500">{c.company || "Individual"}</td>
                          <td className="p-3.5">
                            <div className="flex flex-wrap gap-1">
                              {tags.map((t, idx) => (
                                <span key={idx} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <Badge variant="success" className="text-[10px]">{c.status}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

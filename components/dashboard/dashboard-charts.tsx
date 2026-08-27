"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  snapshots?: any[];
}

export function DashboardCharts({ snapshots = [] }: Props) {
  const [chartView, setChartView] = React.useState<"traffic" | "channels" | "roi">("traffic");

  const formattedData = snapshots.map((s) => ({
    date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    visitors: s.visitors,
    leads: s.leads,
    organic: s.organicTraffic,
    social: s.socialTraffic,
    paid: s.paidTraffic,
    email: s.emailTraffic,
    revenue: s.revenue,
    adSpend: s.adSpend,
  }));

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold">Marketing Performance & Attribution</CardTitle>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              Demo Data Live
            </span>
          </div>
          <CardDescription>
            Multi-touch funnel telemetry across organic search, social virality, and paid advertising
          </CardDescription>
        </div>

        <Tabs value={chartView} onValueChange={(v: any) => setChartView(v)}>
          <TabsList className="h-9">
            <TabsTrigger value="traffic" className="text-xs">
              Visitors & Leads
            </TabsTrigger>
            <TabsTrigger value="channels" className="text-xs">
              Channels Split
            </TabsTrigger>
            <TabsTrigger value="roi" className="text-xs">
              Revenue & ROI
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full">
          {chartView === "traffic" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    borderRadius: "10px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey="visitors" name="Website Visitors" stroke="#0f766e" strokeWidth={2.5} fillOpacity={1} fill="url(#visitorGradient)" />
                <Area type="monotone" dataKey="leads" name="Captured Leads" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#leadGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {chartView === "channels" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    borderRadius: "10px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="organic" name="Organic Search" fill="#0f766e" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="social" name="Social Media" fill="#ec4899" stackId="a" />
                <Bar dataKey="paid" name="Paid Ads" fill="#3b82f6" stackId="a" />
                <Bar dataKey="email" name="Email Drips" fill="#f59e0b" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {chartView === "roi" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    borderRadius: "10px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#revGradient)" />
                <Area type="monotone" dataKey="adSpend" name="Ad Spend ($)" stroke="#ef4444" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

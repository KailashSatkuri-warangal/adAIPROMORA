"use client";

import * as React from "react";
import {
  Cpu,
  Sparkles,
  Zap,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  RefreshCw,
  Layers,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function AutomationPage() {
  const [rules, setRules] = React.useState<any[]>([]);
  const [logs, setLogs] = React.useState<any[]>([]);
  const [isTriggering, setIsTriggering] = React.useState<string | null>(null);

  const fetchAutomation = async () => {
    try {
      const res = await fetch("/api/automation");
      const json = await res.json();
      if (json.rules) setRules(json.rules);
      if (json.logs) setLogs(json.logs);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchAutomation();
  }, []);

  const handleToggle = async (ruleId: string) => {
    try {
      await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleId, action: "toggle" }),
      });
      setRules((prev) =>
        prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestRun = async (ruleId: string) => {
    setIsTriggering(ruleId);
    try {
      await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleId, action: "trigger_test" }),
      });
      await fetchAutomation();
    } catch (e) {
      console.error(e);
    } finally {
      setIsTriggering(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-1 border border-teal-200 dark:border-teal-800">
            <Cpu className="h-3 w-3" />
            <span>Workflow Automation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Event-Driven Marketing Automations
          </h1>
          <p className="text-xs text-slate-500">
            Set up automatic AI actions triggered by published blog posts, campaign ROAS milestones, and lead conversions.
          </p>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
          Active Automation Workflows ({rules.length})
        </div>

        {rules.map((rule) => {
          const actions: any[] = rule.actionsJson ? JSON.parse(rule.actionsJson) : [];
          return (
            <Card key={rule.id} className="shadow-sm border-slate-200 dark:border-slate-800">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 font-bold">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{rule.name}</h3>
                      <div className="text-[11px] text-slate-500">
                        Trigger: <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] dark:bg-slate-800">{rule.triggerEvent}</code>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rule.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {actions.map((act, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1"
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        {act.action || JSON.stringify(act)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestRun(rule.id)}
                    disabled={isTriggering === rule.id}
                    className="h-8 text-xs gap-1.5"
                  >
                    <Play className="h-3 w-3 text-teal-600" />
                    {isTriggering === rule.id ? "Running..." : "Test Trigger"}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => handleToggle(rule.id)}
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {rule.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Execution Logs */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" /> Recent Execution History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{log.rule?.name || "Automated Action"}</span>
                    <div className="text-[11px] text-slate-500">
                      Executed: {new Date(log.executedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px]">{log.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import * as React from "react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const workspaceId = user?.workspaceId;

  let brandName = "VedaGlow Organics India";
  let workspaceName = user?.workspaceName || "AIPROMORA Labs India";
  let generationsUsed = 148;
  let generationsLimit = 1000;

  if (workspaceId) {
    try {
      const brand = await db.brand.findFirst({
        where: { workspaceId },
        orderBy: { createdAt: "desc" },
      });
      if (brand) brandName = brand.name;

      const sub = await db.subscription.findUnique({
        where: { workspaceId },
      });
      if (sub) {
        generationsUsed = sub.generationsUsed;
        generationsLimit = sub.monthlyGenerationsLimit;
      }
    } catch (e) {
      // Fallback on Vercel SQLite serverless transition
    }
  }

  const generationsRemaining = Math.max(0, generationsLimit - generationsUsed);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 antialiased">
      <DashboardSidebar
        generationsUsed={generationsUsed}
        generationsLimit={generationsLimit}
        brandName={brandName}
        workspaceName={workspaceName}
      />
      <div className="pl-64 flex min-h-screen flex-col">
        <DashboardHeader
          user={{
            name: user?.name || "Satkuri Kailash",
            email: user?.email || "kailash@aipromora.in",
            image: user?.image,
            role: user?.role || "OWNER",
          }}
          workspaceName={workspaceName}
          brandName={brandName}
          generationsRemaining={generationsRemaining}
        />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 py-3 px-6 text-center text-[11px] text-slate-400 flex items-center justify-between">
          <span>ad<strong className="text-teal-600 dark:text-teal-400">AIPROMORA</strong> (India & Global Edition)</span>
          <span>Architected & Developed by <strong className="text-slate-700 dark:text-slate-300">Satkuri Kailash</strong></span>
        </footer>
      </div>
    </div>
  );
}

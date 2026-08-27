import * as React from "react";
import { Sparkles } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* Top Banner Skeleton */}
      <div className="h-28 rounded-2xl bg-gradient-to-r from-teal-900/20 via-slate-800/10 to-transparent border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-4 w-72 bg-slate-200/60 dark:bg-slate-800/60 rounded-md" />
        </div>
        <div className="h-9 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs"
          >
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-7 w-7 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
            <div className="h-7 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <div className="h-5 w-44 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-full max-h-72 bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
        </div>
        <div className="h-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800/40 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import * as React from "react";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex flex-col items-center space-y-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white shadow-xl animate-pulse">
          <Sparkles className="h-7 w-7 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <div className="space-y-1">
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">
            ad<span className="text-teal-600 dark:text-teal-400">AIPROMORA</span>
          </div>
          <div className="text-[11px] text-slate-500 animate-pulse">
            Loading AI Marketing Intelligence...
          </div>
        </div>
      </div>
    </div>
  );
}

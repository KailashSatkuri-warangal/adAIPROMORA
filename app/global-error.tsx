"use client";

import * as React from "react";
import Link from "next/link";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-teal-900/60 border border-teal-700 text-teal-400 flex items-center justify-center text-2xl font-black">
            ⚡
          </div>
          <h1 className="text-2xl font-bold">adAIPROMORA System Error</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            An application error occurred. Click below to recover the session.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white transition-all shadow-md"
          >
            Reload adAIPROMORA
          </button>
          <div className="text-[10px] text-slate-500 pt-4">
            Developed by Satkuri Kailash
          </div>
        </div>
      </body>
    </html>
  );
}

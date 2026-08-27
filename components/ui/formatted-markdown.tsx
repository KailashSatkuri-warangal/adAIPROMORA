"use client";

import * as React from "react";
import { CheckCircle2, ChevronRight, Sparkles, Terminal } from "lucide-react";

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

export function FormattedMarkdown({ content, className = "" }: FormattedMarkdownProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockBuffer: string[] = [];
  let codeLanguage = "";

  const renderInlineStyles = (text: string): React.ReactNode => {
    // Split by bold (**text**)
    const boldParts = text.split(/(\*\*[^*]+\*\*)/g);

    return boldParts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const inner = part.slice(2, -2);
        return (
          <strong key={i} className="font-bold text-slate-900 dark:text-slate-50">
            {renderInlineCode(inner)}
          </strong>
        );
      }
      return renderInlineCode(part);
    });
  };

  const renderInlineCode = (text: string): React.ReactNode => {
    const codeParts = text.split(/(`[^`]+`)/g);
    return codeParts.map((part, i) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        const code = part.slice(1, -1);
        return (
          <code
            key={i}
            className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-teal-700 dark:text-teal-300 border border-slate-200 dark:border-slate-700"
          >
            {code}
          </code>
        );
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code block handling
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        // Close block
        renderedElements.push(
          <div
            key={`code-${i}`}
            className="my-3 rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-100 overflow-x-auto shadow-inner"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
              <span className="uppercase tracking-wider font-semibold text-teal-400">
                {codeLanguage || "CODE"}
              </span>
              <Terminal className="h-3 w-3 text-slate-500" />
            </div>
            <pre className="whitespace-pre">{codeBlockBuffer.join("\n")}</pre>
          </div>
        );
        codeBlockBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLanguage = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(line);
      continue;
    }

    // Empty line
    if (!trimmed) {
      renderedElements.push(<div key={`empty-${i}`} className="h-2" />);
      continue;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      renderedElements.push(
        <div key={`h3-${i}`} className="mt-4 mb-2 flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-teal-500" />
          <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {renderInlineStyles(trimmed.slice(4))}
          </h4>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      renderedElements.push(
        <div key={`h2-${i}`} className="mt-5 mb-2.5 pb-1 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span>{renderInlineStyles(trimmed.slice(3))}</span>
          </h3>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith("# ")) {
      renderedElements.push(
        <h2
          key={`h1-${i}`}
          className="text-lg font-black text-slate-900 dark:text-slate-100 mt-5 mb-3"
        >
          {renderInlineStyles(trimmed.slice(2))}
        </h2>
      );
      continue;
    }

    // Numbered step lists (e.g., 1. **Title:** Description)
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      const stepNum = numberedMatch[1];
      const stepText = numberedMatch[2];

      renderedElements.push(
        <div
          key={`step-${i}`}
          className="my-1.5 flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 hover:border-teal-500/40 transition-colors"
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white shadow-xs">
            {stepNum}
          </div>
          <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed pt-0.5">
            {renderInlineStyles(stepText)}
          </div>
        </div>
      );
      continue;
    }

    // Bullet lists (- or *)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const bulletText = trimmed.slice(2);
      renderedElements.push(
        <div key={`bullet-${i}`} className="my-1 flex items-start gap-2.5 pl-1">
          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-600 dark:bg-teal-400 shrink-0" />
          <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {renderInlineStyles(bulletText)}
          </div>
        </div>
      );
      continue;
    }

    // Standard paragraph
    renderedElements.push(
      <p
        key={`p-${i}`}
        className="my-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal"
      >
        {renderInlineStyles(line)}
      </p>
    );
  }

  return <div className={`space-y-0.5 ${className}`}>{renderedElements}</div>;
}

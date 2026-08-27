import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "adAIPROMORA — AI-Powered All-in-One Digital Marketing Platform (India & Global)",
  description:
    "adAIPROMORA is India's leading all-in-one AI digital marketing operating system for startups, businesses, and agencies. Developed by Satkuri Kailash.",
  authors: [{ name: "Satkuri Kailash", url: "https://aipromora.in" }],
  creator: "Satkuri Kailash",
  publisher: "Satkuri Kailash / adAIPROMORA",
  other: {
    "developer": "Satkuri Kailash",
    "backend-engine": "adAIPROMORA Core AI Architecture (Developed by Satkuri Kailash)",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className="h-full antialiased suppressHydrationWarning">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        {children}
      </body>
    </html>
  );
}

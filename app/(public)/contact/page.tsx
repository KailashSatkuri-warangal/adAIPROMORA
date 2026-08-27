"use client";

import * as React from "react";
import { Mail, MessageSquare, Building2, Send, CheckCircle2, Sparkles, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <Badge variant="secondary" className="text-xs">Get In Touch</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Contact adAIPROMORA India & Global Team
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Have questions about our AI digital marketing operating system, agency enterprise plans, or developer advisory?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-4 text-xs">
          <Card className="p-5 space-y-3 shadow-sm border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
              <Mail className="h-4 w-4 text-teal-600" /> Direct Sales & Technical Support
            </div>
            <p className="text-slate-500">support@aipromora.in / kailash@aipromora.in</p>
            <p className="text-[11px] text-slate-400">Response time: under 2 hours (IST hours)</p>
          </Card>

          <Card className="p-5 space-y-3 shadow-sm border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
              <Building2 className="h-4 w-4 text-teal-600" /> Technology Office (India)
            </div>
            <p className="text-slate-500">adAIPROMORA AI Technologies<br />HITEC City, Hyderabad & Outer Ring Rd, Bengaluru, India</p>
          </Card>

          <Card className="p-5 space-y-2 shadow-sm border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs">
              <Code2 className="h-4 w-4 text-teal-600" /> Lead Architect & Engineering
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Platform engineered and developed by <strong>Satkuri Kailash</strong>.
            </p>
          </Card>
        </div>

        <div className="md:col-span-7">
          <Card className="shadow-lg border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 sm:p-8 space-y-4 text-xs">
              {submitted ? (
                <div className="text-center space-y-3 py-8 animate-in fade-in">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Inquiry Received!
                  </h3>
                  <p className="text-slate-500">
                    Thank you for reaching out, <strong>{name || "there"}</strong>. Our team will get back to you at <strong>{email}</strong> shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Your Name</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Karan Singhania"
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none focus:ring-1 focus:ring-teal-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Work Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="karan@brand.in"
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none focus:ring-1 focus:ring-teal-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Message / Inquiry</label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="How can adAIPROMORA help accelerate your digital marketing goals?"
                      className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none focus:ring-1 focus:ring-teal-600"
                    />
                  </div>

                  <Button type="submit" className="w-full h-11 text-xs font-bold gap-2 bg-teal-700 hover:bg-teal-800">
                    <Send className="h-4 w-4" />
                    Send Inquiry
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

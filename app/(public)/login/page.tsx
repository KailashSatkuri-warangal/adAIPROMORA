"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  trackMarketingEvent,
} from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("kailash@aipromora.in");
  const [password, setPassword] = React.useState("password123");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const syncFirebaseUserWithBackend = async (firebaseUser: any) => {
    const res = await fetch("/api/auth/firebase-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      }),
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.error || "Failed to sync session with database");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncFirebaseUserWithBackend(result.user);
      trackMarketingEvent("login_success", { method: "google_firebase" });
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Google sign in error:", err);
      setError(err.message || "Google sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // First attempt standard database login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Attempt Firebase Auth fallback if registered on Firebase
        try {
          const userCred = await signInWithEmailAndPassword(auth, email, password);
          await syncFirebaseUserWithBackend(userCred.user);
        } catch (firebaseErr: any) {
          throw new Error(data.error || firebaseErr.message || "Login failed");
        }
      }
      trackMarketingEvent("login_success", { method: "email_password" });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoQuickLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDemoQuickLogin: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Demo login failed");
      trackMarketingEvent("demo_login_success", { role: "demo_marketer" });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            ad<span className="text-teal-600 dark:text-teal-400">AIPROMORA</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Sign in to adAIPROMORA
        </h2>
        <p className="text-xs text-slate-500">
          Enter your credentials or continue with Google to access your AI marketing engine.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-6 sm:p-8 space-y-5 text-xs">
            {/* Quick Demo Login CTA */}
            <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-center space-y-2">
              <div className="font-bold text-teal-900 dark:text-teal-200">
                ⚡ Instant Demo Access (India & Global)
              </div>
              <p className="text-[11px] text-teal-700 dark:text-teal-300">
                One-click login with pre-seeded demo campaigns, analytics, and SEO data.
              </p>
              <Button
                type="button"
                onClick={handleDemoQuickLogin}
                disabled={isLoading}
                variant="gradient"
                className="w-full h-9 text-xs font-bold gap-1.5 shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Quick Login as Demo Marketer
              </Button>
            </div>

            {/* Google Firebase 1-Click Sign-In */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-10 text-xs font-semibold gap-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 uppercase tracking-wider shrink-0 font-medium">
                Or sign in with email
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] text-teal-600 hover:text-teal-700 dark:text-teal-400 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-xs outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 text-xs font-bold gap-2 bg-teal-700 hover:bg-teal-800"
              >
                {isLoading ? "Signing in..." : "Sign In to adAIPROMORA"}
              </Button>
            </form>

            <div className="text-center pt-2 text-slate-500 text-[11px]">
              Don't have an account?{" "}
              <Link href="/register" className="font-semibold text-teal-600 hover:underline dark:text-teal-400">
                Create a free account
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400">
              Developed by <strong>Satkuri Kailash</strong> • Firebase Real-Time Engine Connected
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

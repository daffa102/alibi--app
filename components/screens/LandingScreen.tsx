"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Zap, Mic, Lock, PhoneCall } from "lucide-react";
import { createClient } from "@/lib/supabase/client";


interface LandingScreenProps {
  onStart: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        alert("Gagal login: " + error.message);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      alert("Error OAuth: " + message);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-5 pt-3 pb-8 justify-between animate-fadeIn bg-gradient-to-b from-white via-purple-50/20 to-slate-100/60 text-slate-800">
      <div className="space-y-4">
        <div className="flex justify-center pt-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-purple-200/70 text-slate-700 text-xs font-medium shadow-xs">
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Alibi Your Social Escape Hatch</span>
          </div>
        </div>

        <div className="relative rounded-3xl bg-white border border-purple-100/90 shadow-sm p-4 sm:p-5 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="relative w-24 h-24 mb-2 flex items-center justify-center">
            <Image
              src="/mascot.jpg"
              alt="Alibi Mascot"
              width={96}
              height={96}
              className="object-contain rounded-2xl drop-shadow-md"
              priority
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-md animate-pulse">
              <PhoneCall className="w-3 h-3 text-white" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
            Emergency Escape Companion
          </p>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Welcome to <span className="text-purple-600">Alibi.</span>
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            An elegant excuse to step out of awkward situations. Sign in once
            for complete call control.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-slate-800 truncate">
                  Instant Emergency Call
                </h4>
                <p className="text-[11px] text-slate-500 truncate sm:whitespace-normal ">
                  Pocket quick-trigger whenever you need a span fast exit
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200/70 shrink-0 whitespace-nowrap">
              1-Tap
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                <Mic className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-slate-800 truncate">
                  Realistic 2-Way Voice
                </h4>
                <p className="text-[11px] text-slate-500 truncate sm:whitespace-normal ">
                  Natural conversation flow with response pauses
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/70 shrink-0 whitespace-nowrap">
              Natural
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-slate-800 truncate">
                  100% Private & Discreet
                </h4>
                <p className="text-[11px] text-slate-500 truncate sm:whitespace-normal">
                  Locally stored data with zero privacy footprint
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/70 shrink-0 whitespace-nowrap">
              Encrypted
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 pt-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="relative z-50 w-full py-3.5 px-4 rounded-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-semibold text-sm flex items-center justify-center gap-3 border border-slate-300 shadow-sm active:scale-[0.98] transition-all cursor-pointer select-none"
        >
          <svg className="w-4 h-4 shrink-0 pointer-events-none" viewBox="0 0 24 24">
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
          <span className="pointer-events-none">Continue with Google</span>
        </button>

        <div className="space-y-0.5">
          <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Your scenario configurations are secure & encrypted</span>
          </p>
          <p className="text-[10px] text-center text-slate-400">
            By signing in, you agree to Alibi&apos;s Terms of Service & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

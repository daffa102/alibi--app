"use client";

import React from "react";
import Image from "next/image";
import { 
  Check, 
  ShieldCheck, 
  Zap, 
  ArrowLeft, 
  Sparkles, 
  Lock 
} from "lucide-react";


interface PricingScreenProps {
  onBack: () => void;
  onSelectPlan: (plan: "lifetime" | "quota") => void;
}


export default function PricingScreen({
  onBack,
  onSelectPlan,
}: PricingScreenProps) {
  return (
    <div className="flex flex-col flex-1 p-5 pt-3 pb-8 justify-between bg-slate-50 text-slate-800 select-none animate-fadeIn">
      <div className="space-y-4">
        
        <div className="text-center pt-2 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 border border-purple-200 text-purple-700 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
            <span>Protection Plans</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Choose Your Escape Plan
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            One-time payment with zero monthly subscription fees.
          </p>
        </div>

        <div className="relative p-4 rounded-3xl bg-white border-2 border-purple-600 shadow-md shadow-purple-500/10 space-y-3.5">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>Recommended • Best Value</span>
          </div>

          <div className="flex items-start justify-between pt-1">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Lifetime Pass
              </h3>
              <p className="text-[11px] text-purple-600 font-semibold">
                Permanent Unlimited Access
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-slate-900">
                Rp 29.000
              </span>
              <p className="text-[10px] text-slate-400 line-through">
                Rp 99.000
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
            {[
              "Unlimited emergency calls forever",
              "Pocket Shake-to-call sensor trigger",
              "Custom voice selection & tuning",
              "One-time payment, active instantly",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="text-[11px]">{benefit}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onSelectPlan("lifetime")}
            className="w-full py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Get Lifetime Pass • Rp 29.000</span>
          </button>
        </div>

                <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Quota Pack
              </h3>
              <p className="text-[11px] text-slate-500">
                3 Emergency Calls
              </p>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-slate-800">
                Rp 9.000
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            {[
              "3 instant emergency calls",
              "Countdown timer trigger",
              "Standard voice presets",
              "No recurring automatic renewal",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span className="text-[11px]">{benefit}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onSelectPlan("quota")}
            className="w-full py-2.5 px-4 rounded-2xl bg-purple-50 hover:bg-purple-100/80 text-purple-700 font-bold text-xs flex items-center justify-center gap-2 border border-purple-200/60 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Choose Quota • Rp 9.000</span>
          </button>
        </div>

      </div>

      <div className="space-y-3 pt-3">
        <div className="flex items-center justify-center gap-1.5 text-slate-500 text-[11px]">
          <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Secure QRIS payment & instant automatic activation</span>
        </div>

        <button
          onClick={onBack}
          className="w-full py-2.5 text-slate-500 hover:text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Setup</span>
        </button>
      </div>

    </div> 
  );
}

"use client";

import React, { useEffect } from "react";
import { Phone, PhoneOff, Lock, User } from "lucide-react";

interface IncomingCallScreenProps {
  callerName: string;
  callerNumber: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function IncomingCallScreen({
  callerName,
  callerNumber,
  onAccept,
  onDecline,
}: IncomingCallScreenProps) {
  useEffect(() => {
    if (
      typeof document !== "undefined" &&
      document.documentElement.requestFullscreen
    ) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([1000, 1000, 1000, 1000, 1000]);
    }

    // Memutar nada dering WhatsApp secara berulang (loop)
    const ringtone = new Audio("/audio/ringtone.mp3");
    ringtone.loop = true;
    ringtone.play().catch((err) => {
      console.warn("Autoplay ringtone blocked by browser:", err);
    });

    return () => {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(0);
      }
      ringtone.pause();
      ringtone.currentTime = 0;
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 p-6 justify-between bg-[#0b141a] text-neutral-100 h-full overflow-hidden select-none animate-fadeIn">
      <div className="flex flex-col items-center pt-4 space-y-1">
        <div className="flex flex-col items-center gap-1.5 text-neutral-400 text-xs">
          <Lock className="w-3 h-3 text-neutral-400" />
          <span>End-to-end encrypted</span>
        </div>
        <p className="text-xs text-neutral-400 font-medium">
          WhatsApp audio call
        </p>
      </div>

      <div className="flex flex-col items-center space-y-3">
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/10 shadow-2xl flex items-center justify-center">
          <User className="w-14 h-14 text-slate-300" />
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-wide text-white">
            {callerName}
          </h1>
          <p className="text-xs font-mono text-neutral-400">{callerNumber}</p>
          <p className="text-sm font-medium text-emerald-400 animate-pulse pt-1">
            Ringing...
          </p>
        </div>
      </div>

      <div className="flex items-center justify-around pb-8 pt-6">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onDecline}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
          <span className="text-xs text-neutral-400 font-medium">Decline</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onAccept}
            className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 active:scale-95 transition-all cursor-pointer animate-pulse"
          >
            <Phone className="w-7 h-7" />
          </button>
          <span className="text-xs text-neutral-400 font-medium">Accept</span>
        </div>
      </div>
    </div>
  );
}

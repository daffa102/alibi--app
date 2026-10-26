"use client";
import { useShakeDetection } from "@/hooks/useShakeDetection";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Zap,
  RotateCcw,
  Play,
  Square,
  Mic,
  Timer,
  Smartphone,
  ChevronRight,
  Infinity as InfinityIcon,
  Heart,
  Briefcase,
  Package,
  Hospital,
  User,
  ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { PRESET_CONTACTS } from "@/constants/preset";
import { ActiveScenario, TriggerMode, PresetContact } from "@/types/alibi";

interface SetupScreenProps {
  quota: number;
  isLifeTime?: boolean;
  onTriggerCall: (scenario: ActiveScenario) => void;
  onUpgrade: () => void;
}

const PRESET_COLOR_MAP: Record<string, string> = {
  mama: "bg-rose-500 border-rose-500 shadow-rose-500/30",
  kantor: "bg-blue-600 border-blue-600 shadow-blue-500/30",
  kurir: "bg-amber-500 border-amber-500 shadow-amber-500/30",
  klinik: "bg-emerald-600 border-emerald-600 shadow-emerald-500/30",
};

const PRESET_ICON_MAP: Record<string, React.ElementType> = {
  mama: Heart,
  kantor: Briefcase,
  kurir: Package,
  klinik: Hospital,
};

export default function SetupScreen({
  quota,
  isLifeTime = false,
  onTriggerCall,
  onUpgrade,
}: SetupScreenProps) {
  const [callerName, setCallerName] = useState<string>("");
  const [callerNumber, setCallerNumber] = useState<string>("+62 812-8899-2310");
  const [script, setScript] = useState<string>("");
  const [selectedPresetId, setSelectPresetId] = useState<string | null>(null);
  const [isPlayingPreview, setIsplayingPreview] = useState<boolean>(false);
  const [voiceGender, setVoiceGender] = useState<"female" | "male">("female");
  const [triggerMode, setTriggerMode] = useState<TriggerMode>("shake");
  const [timeDuration, setTimeDuration] = useState<number>(10);
  const [countDown, setCountDown] = useState<number | null>(null);
  const [isShakeArmed, setIsShakeArmed] = useState<boolean>(false);


  const handleReset = () => {
    setSelectPresetId(null);
    setCallerName("");
    setCallerNumber("+62 812-8899-2310");
    setScript("");
  };

  const handleSelectPreset = (preset: PresetContact) => {
    if (selectedPresetId === preset.id) {
      handleReset();
      return;
    }
    setSelectPresetId(preset.id);
    setCallerName(preset.callerName);
    setCallerNumber(preset.callerNumber);
    setScript(preset.defaultScript);
  };

  const handleToggleAudioPreview = () => {
    if (isPlayingPreview) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsplayingPreview(false);
      return;
    }

    if (selectedPresetId) {
      const preset = PRESET_CONTACTS.find((p) => p.id === selectedPresetId);
      if (preset?.audioPath) {
        const audio = new Audio(preset.audioPath);
        setIsplayingPreview(true);
        audio.play().catch(() => setIsplayingPreview(false));
        audio.onended = () => setIsplayingPreview(false);
        return;
      }
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const naturalScript = (
        script || "Halo? Ini tes suara panggilan."
      ).replace(/([,?.!])/g, "$1... ");
      const utterance = new SpeechSynthesisUtterance(naturalScript);
      utterance.lang = "id-ID";
      if (voiceGender === "male") {
        utterance.rate = 0.95;
        utterance.pitch = 0.85;
      } else {
        utterance.rate = 0.92;
        utterance.pitch = 1.05;
      }

      const voices = window.speechSynthesis.getVoices();
      const idVoices = voices.filter(
        (v) => v.lang.includes("id") || v.lang.includes("ID"),
      );
      if (idVoices.length > 0) {
        if (voiceGender === "male") {
          const maleVoice = idVoices.find(
            (v) =>
              v.name.includes("Ardi") ||
              v.name.includes("Male") ||
              v.name.includes("David"),
          );
          if (maleVoice) utterance.voice = maleVoice;
          else utterance.voice = idVoices[0];
        } else {
          const femaleVoice = idVoices.find(
            (v) =>
              v.name.includes("Gadis") ||
              v.name.includes("Female") ||
              v.name.includes("Zira"),
          );
          if (femaleVoice) utterance.voice = femaleVoice;
          else utterance.voice = idVoices[0];
        }
      }

      utterance.onstart = () => setIsplayingPreview(true);
      utterance.onend = () => setIsplayingPreview(false);
      utterance.onerror = () => setIsplayingPreview(false);
      window.speechSynthesis.speak(utterance);
    }
  };

   useEffect(() => {
    if (countDown === null) return;

    const timer = setTimeout(() => {
      if (countDown <= 1) {
        setCountDown(null);

        const scenarioData: ActiveScenario = {
          callerName: callerName.trim() || "Private Number",
          callerNumber: callerNumber.trim() || "+62 812-8899-2310",
          script: script.trim() || "Halo? Bisa dengar suara saya?",
          audioUrl: selectedPresetId
            ? PRESET_CONTACTS.find((p) => p.id === selectedPresetId)?.audioPath
            : undefined,
          voiceGender: voiceGender,
          triggerMode: triggerMode,
          timeDuration: timeDuration,
        };

        onTriggerCall(scenarioData);
      } else {
        setCountDown((prev) => (prev !== null ? prev - 1 : null));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    countDown,
    callerName,
    callerNumber,
    script,
    selectedPresetId,
    voiceGender,
    triggerMode,
    timeDuration,
    onTriggerCall,
  ]);

  
  useShakeDetection({
    enabled: triggerMode === "shake" && isShakeArmed,
    targetShakes: 3,
    threshold: 6,
    onShake: () => {
      setIsShakeArmed(false);

      if (!isLifeTime && quota <= 0) {
        onUpgrade();
        return;
      }

      const scenarioData: ActiveScenario = {
        callerName: callerName.trim() || "Private Number",
        callerNumber: callerNumber.trim() || "+62 812-8899-2310",
        script: script.trim() || "Halo? Bisa dengar suara saya?",
        audioUrl: selectedPresetId
          ? PRESET_CONTACTS.find((p) => p.id === selectedPresetId)?.audioPath
          : undefined,
        voiceGender: voiceGender,
        triggerMode: "shake",
        timeDuration: 0,
      };

      onTriggerCall(scenarioData);
    },
  });

  const handleExecuteTrigger = () => {
    if (!isLifeTime && quota <= 0) {
      onUpgrade();
      return;
    }

    if (triggerMode === "timer") {
      if (countDown !== null) {
        setCountDown(null);
      } else {
        setCountDown(timeDuration);
      }
      return;
    }

    if (triggerMode === "shake") {
      setIsShakeArmed((prev) => !prev);
      return;
    }
  };

  return (
    <div className="flex flex-col flex-1 p-5 pt-3 pb-8 justify-between bg-slate-50 text-slate-800">
      <div className="space-y-5">
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full bg-white border border-purple-200 shadow-xs flex items-center justify-center overflow-hidden">
              <Image
                src="/mascot.jpg"
                alt="alibi"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Emergency Call Setup
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                CONFIGURE ALIBI
              </p>
            </div>
          </div>
          {isLifeTime ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 border border-purple-200 text-purple-700 text-xs font-semibold shadow-xs">
              <Zap className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
              <span className="flex items-center gap-1">
                <InfinityIcon className="w-3.5 h-3.5" /> Unlimited
              </span>
            </div>
          ) : (
            <button
              onClick={onUpgrade}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-semibold shadow-xs hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Quota: {quota}x</span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Quick Shortcuts
            </label>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {PRESET_CONTACTS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              const IconComp = PRESET_ICON_MAP[preset.id];
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={cn(
                    "p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer",
                    isSelected
                      ? cn(
                          PRESET_COLOR_MAP[preset.id] ||
                            "bg-purple-600 border-purple-600 shadow-purple-500/30",
                          "text-white shadow-md scale-[1.04]",
                        )
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-xs",
                  )}
                >
                  {IconComp && (
                    <IconComp
                      className={cn(
                        "w-5 h-5 transition-transform",
                        isSelected ? "text-white scale-110" : "text-slate-600",
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "text-[11px] font-bold tracking-wide transition-colors",
                      isSelected ? "text-white" : "text-slate-700",
                    )}
                  >
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Caller Name
            </label>
            <input
              type="text"
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
              placeholder="e.g. Mama, Head of Tech, Courier"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 shadow-xs transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Fake WhatsApp Number
            </label>
            <input
              type="text"
              value={callerNumber}
              onChange={(e) => setCallerNumber(e.target.value)}
              placeholder="+62 812-8899-2310"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 shadow-xs transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">
            Call Voice
          </label>

          <textarea
            rows={3}
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Type your emergency excuse or script here..."
            className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 shadow-xs transition-all resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-0.5 gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={voiceGender}
                  onChange={(e) =>
                    setVoiceGender(e.target.value as "female" | "male")
                  }
                  className="appearance-none pl-8 pr-7 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:border-purple-500 cursor-pointer shadow-xs hover:bg-slate-50 transition-all"
                >
                  <option value="female">Suara Wanita</option>
                  <option value="male">Suara Pria</option>
                </select>
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="button"
                onClick={handleToggleAudioPreview}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-purple-100/70 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                {isPlayingPreview ? (
                  <>
                    <Square className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-purple-700 fill-purple-700" />
                    <span>Test Audio</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              title="Record Voice Note"
              className="w-9 h-9 rounded-2xl bg-orange-100/60 hover:bg-orange-100 border border-orange-200/70 flex items-center justify-center text-orange-700 transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">
            Trigger Method
          </label>

          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/70">
            <button
              onClick={() => setTriggerMode("timer")}
              className={cn(
                "py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                triggerMode === "timer"
                  ? "bg-white text-purple-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Countdown</span>
            </button>

            <button
              onClick={() => setTriggerMode("shake")}
              className={cn(
                "py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                triggerMode === "shake"
                  ? "bg-white text-purple-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Shake in Pocket</span>
            </button>
          </div>

          {triggerMode === "timer" ? (
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { label: "10s", value: 10 },
                { label: "30s", value: 30 },
                { label: "1m", value: 60 },
                { label: "3m", value: 180 },
              ].map((time) => {
                const isActive = timeDuration === time.value;
                return (
                  <button
                    key={time.value}
                    onClick={() => setTimeDuration(time.value)}
                    className={cn(
                      "py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                      isActive
                        ? "bg-purple-700 border-purple-700 text-white shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs",
                    )}
                  >
                    {time.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-purple-700 flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 shrink-0 text-purple-600" />
              <span>
                Put phone in pocket. Shake 3 times firmly to trigger incoming
                call!
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4">
        {!isLifeTime && quota <= 0 ? (
          <button
            onClick={onUpgrade}
            className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Quota Exhausted • Get Unlimited Pass</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleExecuteTrigger}
            className={cn(
              "w-full py-3.5 px-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer text-white",
              countDown !== null
                ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/30 animate-pulse"
                : isShakeArmed
                ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30 animate-pulse"
                : triggerMode === "timer"
                ? "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
                : "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
            )}
          >
            {countDown !== null ? (
              <>
                <Timer className="w-4 h-4 animate-spin" />
                <span>Calling in {countDown}s... (Tap to Cancel)</span>
              </>
            ) : isShakeArmed ? (
              <>
                <Smartphone className="w-4 h-4 animate-bounce" />
                <span>Sensor Active • Shake 3x in pocket (Cancel)</span>
              </>
            ) : triggerMode === "timer" ? (
              <>
                <Zap className="w-4 h-4" />
                <span>Call Now! ({timeDuration}s)</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4" />
                <span>Activate Shake Sensor</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, PhoneOff, Lock, User } from "lucide-react";

interface ActiveCallScreenProps {
  callerName: string;
  callerNumber: string;
  script: string;
  audioUrl?: string;
  voiceGender?: "female" | "male";
  onEndCall: () => void;
}

export default function ActiveCallScreen({
  callerName,
  callerNumber,
  script,
  audioUrl,
  voiceGender = "female",
  onEndCall,
}: ActiveCallScreenProps) {
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const formatTime = (totalSecond: number) => {
    const minutes = Math.floor(totalSecond / 60);
    const seconds = totalSecond % 60;
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    let audioPlayer: HTMLAudioElement | null = null;

    if (audioUrl) {
      audioPlayer = new Audio(audioUrl);
      setIsSpeaking(true);

      audioPlayer.play().catch((err) => {
        console.warn("Failed to start audio preset", err);
      });

      audioPlayer.onended = () => {
        setIsSpeaking(false);
      };
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Trik jeda nafas manusia pada tanda baca
      const naturalScript = (script || "Halo?").replace(/([,?.!])/g, "$1... ");
      const utterance = new SpeechSynthesisUtterance(naturalScript);
      utterance.lang = "id-ID";

      // Kalibrasi nada & tempo sesuai pilihan Suara Wanita / Suara Pria
      if (voiceGender === "male") {
        utterance.rate = 0.95;
        utterance.pitch = 0.85; // Nada berat berwibawa
      } else {
        utterance.rate = 0.92;
        utterance.pitch = 1.05; // Nada lembut hangat
      }

      // Pilih suara Indonesia terbaik dari browser jika tersedia
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

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }

    return () => {
      clearInterval(timerInterval);

      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }

      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audioUrl, script, voiceGender]);

  return (
    <div className="flex flex-col flex-1 p-6 justify-between bg-[#0b141a] text-neutral-100 h-full overflow-hidden select-none animate-fadeIn">
      <div className="flex flex-col items-center pt-4 space-y-1">
        <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
          <Lock className="w-3 h-3 text-neutral-400" />
          <span>End-to-end encrypted</span>
        </div>
        <p className="text-xs text-neutral-400 font-medium">
          WhatsApp audio call
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/10 shadow-2xl flex items-center justify-center">
          <User className="w-16 h-16 text-slate-300" />
        </div>

        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-bold tracking-wide text-white">
            {callerName}
          </h1>
          <p className="text-xs font-mono text-neutral-400">{callerNumber}</p>

          <p className="text-sm font-mono text-neutral-300 font-medium pt-1">
            {formatTime(callDuration)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-around pb-8 pt-6">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isMuted
                ? "bg-white text-slate-900 shadow-lg"
                : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
            }`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
          <span className="text-[11px] text-neutral-400">Mute</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onEndCall}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 active:scale-95 transition-all cursor-pointer"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
          <span className="text-[11px] text-neutral-400">End call</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isSpeakerOn
                ? "bg-white text-slate-900 shadow-lg"
                : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
            }`}
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <span className="text-[11px] text-neutral-400">Speaker</span>
        </div>
      </div>
    </div>
  );
}

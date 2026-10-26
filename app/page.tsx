"use client";

import React, { useState, useEffect } from "react";
import MobileContainer from "@/components/layout/MobileContainer";
import LandingScreen from "@/components/screens/LandingScreen";
import SetupScreen from "@/components/screens/ScreenSetup";
import { ScreenState, ActiveScenario } from "@/types/alibi";
import IncomingCallScreen from "@/components/screens/IncomingCallScreen";
import ActiveCallScreen from "@/components/screens/ActiveCallScreen";
import PricingScreen from "@/components/screens/PricingScreen";
import { createClient } from "@/lib/supabase/client";

interface SnapResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
}

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: SnapResult) => void;
          onPending?: (result: SnapResult) => void;
          onError?: (result: SnapResult) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}


export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>("landing");
  const [quota, setQuota] = useState<number>(0);
  const [isLifeTime, setIsLifeTime] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<ActiveScenario | null>(
    null,
  );

    useEffect(() => {
    const supabase = createClient();

    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("quota, is_lifetime")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setQuota(profile.quota);
          setIsLifeTime(profile.is_lifetime);
        }
        
        setCurrentScreen("setup");
      }
    };

    checkUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("quota, is_lifetime")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            setQuota(profile.quota);
            setIsLifeTime(profile.is_lifetime);
          }
          setCurrentScreen("setup");
        } else if (event === "SIGNED_OUT") {
          setCurrentScreen("landing");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  const handleStart = () => {
    setCurrentScreen("setup");
  };

  const handleTriggerCall = (scenario: ActiveScenario) => {
    

        if (!isLifeTime && quota <= 0) {
      alert("Kuota darurat kamu sudah habis. Silakan beli paket terlebih dahulu! ⚡");
      setCurrentScreen("pricing");
      return;
    }

    setActiveScenario(scenario);
    setCurrentScreen("ringing");

  };

  const handleUpgrade = () => {
    setCurrentScreen("pricing");
  };

  const handleDeclineCall = () => {
    setCurrentScreen("setup");
  };

    const handleAcceptCall = async () => {
    if (!isLifeTime && quota > 0) {
      const nextQuota = quota - 1;
      setQuota(nextQuota);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({ quota: nextQuota })
          .eq("id", user.id);

        if (error) {
          console.error("Gagal update kuota di Supabase:", error.message);
        }
      }
    }
    setCurrentScreen("in call");
  };


  const handleEndCall = () => {
    setCurrentScreen("setup");
  };

  const handleSelectPlan = async (plan: "lifetime" | "quota") => {
        try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Silakan login terlebih dahulu untuk membeli paket!");
        return;
      }

      const response = await fetch("/api/tokenizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          userId: user.id,
          userEmail: user.email,
          clientOrigin: window.location.origin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mendapatkan token pembayaran");
      }

      // 2. Buka Popup Midtrans Snap via window.snap yang sudah bertipe
      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: function (result: SnapResult) {
            console.log("Pembayaran Berhasil:", result);
            alert("Pembayaran berhasil! Paket kamu sedang diaktifkan ✨");
            if (plan === "lifetime") {
              setIsLifeTime(true);
            } else {
              setQuota((prev) => prev + 3);
            }
            setCurrentScreen("setup");
          },
          onPending: function (result: SnapResult) {
            console.log("Menunggu Pembayaran:", result);
            alert("Silakan selesaikan pembayaran kamu sesuai instruksi.");
          },
          onError: function (result: SnapResult) {
            console.error("Pembayaran Gagal:", result);
            alert("Pembayaran gagal atau dibatalkan.");
          },
          onClose: function () {
            console.log("Popup pembayaran ditutup oleh user.");
          },
        });
      } else {
        alert("Sistem pembayaran Midtrans belum siap dimuat. Coba beberapa saat lagi.");
      }
    } catch (error: unknown) {
      console.error("Error Transaksi:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memulai pembayaran.";
      alert(message);
    }

  };

  return (
    <MobileContainer>
      {currentScreen === "landing" && <LandingScreen onStart={handleStart} />}

      {currentScreen === "setup" && (
        <SetupScreen
          quota={quota}
          isLifeTime={isLifeTime}
          onTriggerCall={handleTriggerCall}
          onUpgrade={handleUpgrade}
        />
      )}

      {currentScreen === "ringing" && activeScenario && (
        <IncomingCallScreen
          callerName={activeScenario.callerName}
          callerNumber={activeScenario.callerNumber}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
        />
      )}

      {currentScreen === "in call" && activeScenario && (
        <ActiveCallScreen
          callerName={activeScenario.callerName}
          callerNumber={activeScenario.callerNumber}
          script={activeScenario.script}
          audioUrl={activeScenario.audioUrl}
          voiceGender={activeScenario.voiceGender}
          onEndCall={handleEndCall}
        />
      )}

      {currentScreen === "pricing" && (
        <PricingScreen
          onBack={() => setCurrentScreen("setup")}
          onSelectPlan={handleSelectPlan}
        />
      )}
    </MobileContainer>
  );
}

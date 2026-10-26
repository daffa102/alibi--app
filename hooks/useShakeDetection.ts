"use client";

import { useEffect, useRef } from "react";

interface ShakeOption {
  enabled: boolean;
  targetShakes?: number;
  threshold?: number;
  onShake: () => void;
  onProgress?: (count: number, force: number, eventCount: number) => void;
}

export function useShakeDetection({
  enabled,
  targetShakes = 3,
  threshold = 12,
  onShake,
  onProgress,
}: ShakeOption) {
  const shakeCount = useRef<number>(0);
  const lastShakeTime = useRef<number>(0);
  const eventCounter = useRef<number>(0);

  const lastX = useRef<number>(0);
  const lastY = useRef<number>(0);
  const lastZ = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      const current = event.accelerationIncludingGravity;

      if (
        !current ||
        current.x === null ||
        current.y === null ||
        current.z === null
      )
        return;

  

      const now = Date.now();

            const totalForce = Math.sqrt(
        current.x * current.x + current.y * current.y + current.z * current.z
      );


      const shakeForce = Math.abs(totalForce - 9.8);

      // Kirim data live ke layar UI (real‑time telemetry)
      eventCounter.current += 1;
      if (onProgress) {
        onProgress(shakeCount.current, shakeForce, eventCounter.current);
      }

      if (shakeForce > threshold && now - lastShakeTime.current > 300) {
        lastShakeTime.current = now;
        shakeCount.current += 1;

        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(50);
        }

        if (shakeCount.current >= targetShakes) {
          shakeCount.current = 0;
          onShake();
        }
      }

      if (now - lastShakeTime.current > 3000 && shakeCount.current > 0) {
        shakeCount.current = 0;
      }
    };

    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [enabled, targetShakes, threshold, onShake, onProgress]);
}

"use client";

import { useEffect, useState } from "react";

/** Public launch moment — August 14, 2026 (local midnight). */
export const SHORTKEY_LAUNCH_AT = new Date(2026, 7, 14, 0, 0, 0, 0).getTime();

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function partsFromMs(ms: number): CountdownParts {
  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const totalSec = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    done: false,
  };
}

export function useLaunchCountdown(targetMs = SHORTKEY_LAUNCH_AT): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(() =>
    partsFromMs(targetMs - Date.now()),
  );

  useEffect(() => {
    const tick = () => setParts(partsFromMs(targetMs - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  return parts;
}
